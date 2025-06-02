import React, { useState, useRef, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";

const ChatbotIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15a2 2 0 0 1-2 2h-1l-3 3v-3H9a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2z"></path>
    <line x1="8" y1="10" x2="8" y2="10"></line>
    <line x1="12" y1="10" x2="12" y2="10"></line>
  </svg>
);

const QRPopup: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const whatsappLink = "https://wa.me/7823812240";
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        visible &&
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setVisible(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [visible]);

  return (
    <>
      <button
        onClick={() => setVisible(!visible)}
        aria-label="Toggle WhatsApp QR Code"
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          backgroundColor: "#25D366",
          border: "none",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          cursor: "pointer",
          boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background-color 0.3s",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = "#1ebe57")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = "#25D366")
        }
      >
        <ChatbotIcon />
      </button>

      <div
        ref={popupRef}
        style={{
          position: "fixed",
          bottom: visible ? "90px" : "70px",
          right: "20px",
          background: "#fff",
          padding: "20px",
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
          zIndex: 1000,
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? "auto" : "none",
          transform: visible ? "translateY(0)" : "translateY(10px)",
          transition: "opacity 0.3s ease, transform 0.3s ease, bottom 0.3s ease",
          width: "220px",
          userSelect: "none",
        }}
      >
        <p
          style={{
            textAlign: "center",
            marginBottom: "12px",
            fontWeight: "600",
            color: "#333",
          }}
        >
          Scan to chat on WhatsApp
        </p>
        <QRCodeCanvas
          value={whatsappLink}
          size={180}
          bgColor="#ffffff"
          fgColor="#25D366"
          level="H"
          includeMargin={true}
        />
      </div>
    </>
  );
};

export default QRPopup;
