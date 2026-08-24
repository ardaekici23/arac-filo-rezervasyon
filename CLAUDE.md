# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Araç Filo / Zimmet Rezervasyon Sistemi — a company vehicle fleet reservation system (Turkish internship project). Full functional spec lives in `arac-filo-rezervasyon-proje.md` — read it for business rules and scope before implementing features, especially the reservation conflict-check rule (section 4.1, item 6) which is the project's central requirement.

Backend and frontend both exist. `frontend/` is a React + Vite SPA (see `frontend/README.md`) that consumes the backend REST API; it adapts the original design mockup to the backend's actual field/enum names rather than the richer schema the mockup assumed (no vehicle photos/year/seats/fuel type, no reservation approval workflow).

## Architecture

Single-module Spring Boot app (Java 21, Maven) using **package-by-feature**, not package-by-layer. This is a deliberate simplification from an earlier DDD/multi-module (domain/application/infrastructure/api/bootstrap) design that was judged over-engineered for this project's scope — do not reintroduce port/adapter interfaces, separate domain-vs-JPA-entity classes, or additional Maven modules.

```
backend/src/main/java/com/aracfilo/
  vehicle/       araç (vehicle) feature: Entity, Repository, Service, Controller, Request/Response DTOs
  reservation/   rezervasyon (reservation) feature: same shape
  user/          kullanıcı (user) feature: same shape — login is an upsert-by-email, not password auth
  common/        cross-cutting: NotFoundException, BusinessRuleException, ApiErrorResponse, GlobalExceptionHandler, WebConfig (CORS)
```

Each feature package is self-contained end-to-end (Controller → Service → Repository → Entity) rather than split across layer-named top-level packages. When adding a feature, follow this same package shape.

Key structural points:
- Entities (`Vehicle`, `Reservation`) are plain `@Entity` classes that double as the domain model — there is no separate domain object. Enums (`VehicleType`, `VehicleStatus`, `ReservationStatus`) map via `@Enumerated(EnumType.STRING)`.
- Repositories are plain `interface Foo extends JpaRepository<Foo, Long>` — no manual implementation classes.
- `backend/pom.xml` parents directly off `spring-boot-starter-parent`, so `spring-boot-maven-plugin`'s `repackage` goal auto-binds to `mvn package` with no explicit `<executions>` block needed.
- Error handling: throw `NotFoundException` (→ 404) or `BusinessRuleException` (→ 400) from services/entities; `GlobalExceptionHandler` (`common/`) converts them to `ApiErrorResponse` JSON. Don't add per-controller try/catch.
- Table/column names are Turkish (`araclar`, `rezervasyonlar`, `plaka`, `marka_model`, `baslangic_tarihi`, etc.) and DTO/field names follow suit (`kullaniciAdi`, `durum`). Keep this convention consistent — don't mix English and Turkish naming within the same layer.
- `Reservation`'s constructor enforces `bitisTarihi.isAfter(baslangicTarihi)` via `BusinessRuleException`. `DateRange.overlaps()` (in `reservation/DateRange.java`) is wired into `ReservationService.create()`: it rejects a new reservation with `BusinessRuleException` (→ 400) when it overlaps an existing non-`IPTAL` reservation for the same vehicle.

## Database & migrations

PostgreSQL, schema-versioned with Flyway. Migration files live in `backend/src/main/resources/db/migration/` (`V1__create_araclar_table.sql`, `V2__create_rezervasyonlar_table.sql`). Hibernate runs with `ddl-auto: validate` — it never auto-generates schema, so any entity/column change must be paired with a new `V{n}__description.sql` migration file, never an edit to an existing one.

`application.yml` = local profile (localhost datasource). `application-docker.yml` = `docker` profile, reads datasource creds from env vars (`SPRING_DATASOURCE_URL/USERNAME/PASSWORD`), activated via `SPRING_PROFILES_ACTIVE=docker` in `docker-compose.yml`.

DB credentials/name come from `.env` (gitignored; see `.env.example` for the shape: `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`). The `pgdata` named Docker volume persists across `docker compose down`/container recreation — deleting containers does not reset the schema or data, only `docker compose down -v` does.

## Common commands

Run from `backend/`:
```
mvn clean compile          # compile-only check
mvn clean package          # build the jar (target/filo-rezervasyon.jar)
mvn spring-boot:run         # run locally against localhost:5432 (needs local Postgres + application.yml creds)
```

Run from repo root:
```
docker compose up --build -d   # build backend image + start db (postgres:16-alpine) and backend containers
docker compose ps -a            # check container health
docker compose down             # stop containers, keep pgdata volume (data survives)
docker compose down -v          # stop containers AND wipe pgdata volume (data loss)
```

Backend serves on `:8080`; Swagger UI at `/swagger-ui.html` (springdoc). Postgres on `:5432` (exposed to host via compose).

Run from `frontend/`:
```
npm install
npm run dev          # http://localhost:5173, expects backend on :8080
npm run build
```

No test suite exists yet — `spring-boot-starter-test` is on the classpath but there are no test classes under `backend/src/test`.

## Working notes

- REST endpoint contracts (`/api/araclar`, `/api/rezervasyonlar`) and DTO field names are treated as stable — the codebase's structure has been refactored around them once already without changing them, and that's the intended pattern for future internal refactors too.
- `ReservationController` has a `PATCH /api/rezervasyonlar/{id}/durum` endpoint for status transitions (`ReservationStatusRequest`), but nothing currently drives automatic transitions (e.g. PLANLANDI → TAMAMLANDI over time) — status changes are manual/API-driven only (the frontend's admin pages drive this).
- There is no cancel-specific endpoint; cancellation goes through the same `durum` PATCH endpoint (setting `IPTAL`).
- `GET /api/araclar/musait?baslangic&bitis` (available-vehicles-by-date-range) exists on `VehicleController`/`VehicleService`, computed by excluding vehicles with a `Reservation` overlapping the range.
- There is no session/token-based auth (no Spring Security filter chain). Passwords are real though: `kullanicilar.sifre_hash` stores a BCrypt hash (`spring-security-crypto`'s `BCryptPasswordEncoder`, used directly as a plain utility — no `@EnableWebSecurity`). `POST /api/kullanicilar/kayit` registers (rejects a duplicate `eposta` with `BusinessRuleException`); `POST /api/kullanicilar/giris` verifies eposta+sifre and returns the user or a 400 with a Turkish message ("Şifre hatalı" / "Bu e-posta ile kayıt bulunamadı"). The frontend stores whatever `UserResponse` comes back (never the hash) to gate which routes/nav render. This does not restrict the API itself — any client can still call `/api/araclar` or `/api/rezervasyonlar` directly regardless of role.
- `DemoUserSeeder` (`user/`) inserts two fixed demo accounts on every startup if missing (`elif@sirket.com` / `admin@sirket.com`, both password `123456`) — matches the hint text on the login screen. Idempotent (checks `findByEposta` first).
- CORS is opened for `/api/**` via `common/WebConfig.java`, controlled by the `app.cors.allowed-origins` property (`application.yml` defaults to `http://localhost:5173`; `application-docker.yml` reads `APP_CORS_ALLOWED_ORIGINS`).
