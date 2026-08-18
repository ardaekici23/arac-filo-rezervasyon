package com.aracfilo.domain.shared;

public record EntityId<T>(T value) {

    public EntityId {
        if (value == null) {
            throw new DomainException("EntityId value cannot be null");
        }
    }
}
