import { useNavigate } from 'react-router-dom';

export default function ReservationSuccessModal({ arac, aralik, no, onClose }) {
  const navigate = useNavigate();

  const devamEt = () => {
    onClose();
    navigate('/rezervasyonlarim');
  };

  return (
    <div className="modal-overlay modal-overlay-center" onClick={devamEt}>
      <div className="modal modal-narrow modal-success" onClick={(e) => e.stopPropagation()}>
        <div className="success-icon">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5"></path>
          </svg>
        </div>
        <h2 className="success-title">Rezervasyon isteği oluşturuldu</h2>
        <p className="success-text">Talebin filo yöneticisinin onayına gönderildi. Durumu Rezervasyonlarım sayfasından takip edebilirsin.</p>

        <div className="success-info-box">
          <div className="success-info-row">
            <span className="summary-label">Araç</span>
            <span className="summary-value">{arac}</span>
          </div>
          <div className="success-info-row">
            <span className="summary-label">Tarih</span>
            <span className="summary-value">{aralik}</span>
          </div>
          <div className="success-info-row">
            <span className="summary-label">Talep no</span>
            <span className="summary-value">#{no}</span>
          </div>
        </div>

        <button type="button" className="btn btn-dark btn-block" onClick={devamEt}>Rezervasyonlarıma git</button>
      </div>
    </div>
  );
}
