import React from "react";

interface NerdCharacterProps {
  size?: number;
  className?: string;
  animated?: boolean;
}

const NerdCharacter = ({
  size = 200,
  className = "",
  animated = false,
}: NerdCharacterProps) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        className={animated ? "animate-bounce" : ""}
      >
        {/* 배경 원 (옵션) */}
        <circle
          cx="100"
          cy="100"
          r="95"
          fill="rgba(0, 246, 255, 0.1)"
          stroke="rgba(0, 246, 255, 0.3)"
          strokeWidth="2"
        />
        {/* 거북이 몸통 */}
        <ellipse
          cx="100"
          cy="140"
          rx="45"
          ry="35"
          fill="#4A5D23"
          stroke="#3A4D13"
          strokeWidth="2"
        />
        {/* 등껍질 패턴 */}
        <ellipse cx="100" cy="135" rx="35" ry="25" fill="#5D7A2A" />
        <path d="M 75 125 Q 100 115 125 125 Q 100 135 75 125" fill="#6B8B3D" />
        <path d="M 85 140 Q 100 130 115 140 Q 100 150 85 140" fill="#6B8B3D" />
        {/* 체크 남방 */}
        <rect
          x="75"
          y="155"
          width="50"
          height="35"
          fill="#E8F4FD"
          stroke="#D1E7DD"
          strokeWidth="1"
        />
        {/* 체크 패턴 */}
        <line
          x1="75"
          y1="165"
          x2="125"
          y2="165"
          stroke="#A8C7E0"
          strokeWidth="1"
        />
        <line
          x1="75"
          y1="175"
          x2="125"
          y2="175"
          stroke="#A8C7E0"
          strokeWidth="1"
        />
        <line
          x1="85"
          y1="155"
          x2="85"
          y2="190"
          stroke="#A8C7E0"
          strokeWidth="1"
        />
        <line
          x1="95"
          y1="155"
          x2="95"
          y2="190"
          stroke="#A8C7E0"
          strokeWidth="1"
        />
        <line
          x1="105"
          y1="155"
          x2="105"
          y2="190"
          stroke="#A8C7E0"
          strokeWidth="1"
        />
        <line
          x1="115"
          y1="155"
          x2="115"
          y2="190"
          stroke="#A8C7E0"
          strokeWidth="1"
        />
        {/* 거북목 (길게 늘어난 목) */}
        <ellipse
          cx="100"
          cy="110"
          rx="15"
          ry="25"
          fill="#6B8635"
          stroke="#5D7A2A"
          strokeWidth="1"
        />
        {/* 머리 */}
        <circle
          cx="100"
          cy="85"
          r="25"
          fill="#6B8635"
          stroke="#5D7A2A"
          strokeWidth="2"
        />
        {/* 동그란 안경 */}
        <circle
          cx="92"
          cy="80"
          r="8"
          fill="rgba(255, 255, 255, 0.9)"
          stroke="#333"
          strokeWidth="2"
        />
        <circle
          cx="108"
          cy="80"
          r="8"
          fill="rgba(255, 255, 255, 0.9)"
          stroke="#333"
          strokeWidth="2"
        />
        <line x1="100" y1="80" x2="100" y2="80" stroke="#333" strokeWidth="2" />
        <line x1="84" y1="78" x2="80" y2="76" stroke="#333" strokeWidth="2" />
        <line x1="116" y1="78" x2="120" y2="76" stroke="#333" strokeWidth="2" />
        {/* 안경 반사 효과 */}
        <circle cx="90" cy="77" r="3" fill="rgba(255, 255, 255, 0.8)" />
        <circle cx="106" cy="77" r="3" fill="rgba(255, 255, 255, 0.8)" />
        {/* 눈 */}
        <circle cx="92" cy="80" r="3" fill="#333" />
        <circle cx="108" cy="80" r="3" fill="#333" />
        <circle cx="93" cy="79" r="1" fill="#fff" />
        <circle cx="109" cy="79" r="1" fill="#fff" />
        {/* 코 */}
        <ellipse cx="100" cy="87" rx="2" ry="1" fill="#5D7A2A" />
        {/* 입 (살짝 미소) */}
        <path
          d="M 95 92 Q 100 95 105 92"
          stroke="#5D7A2A"
          strokeWidth="1.5"
          fill="none"
        />
        {/* 팔 (키보드 들고 있는) */}
        <ellipse
          cx="75"
          cy="125"
          rx="8"
          ry="20"
          fill="#6B8635"
          stroke="#5D7A2A"
          strokeWidth="1"
          transform="rotate(-20 75 125)"
        />
        <ellipse
          cx="125"
          cy="125"
          rx="8"
          ry="20"
          fill="#6B8635"
          stroke="#5D7A2A"
          strokeWidth="1"
          transform="rotate(20 125 125)"
        />
        {/* 손 */}
        <circle
          cx="68"
          cy="115"
          r="6"
          fill="#6B8635"
          stroke="#5D7A2A"
          strokeWidth="1"
        />
        <circle
          cx="132"
          cy="115"
          r="6"
          fill="#6B8635"
          stroke="#5D7A2A"
          strokeWidth="1"
        />
        {/* 미니 키보드 */}
        <rect
          x="85"
          y="108"
          width="30"
          height="12"
          rx="2"
          fill="#2A2A2A"
          stroke="#1A1A1A"
          strokeWidth="1"
        />
        {/* 키보드 키들 */}
        <rect x="87" y="110" width="3" height="2" fill="#444" />
        <rect x="91" y="110" width="3" height="2" fill="#444" />
        <rect x="95" y="110" width="3" height="2" fill="#444" />
        <rect x="99" y="110" width="3" height="2" fill="#444" />
        <rect x="103" y="110" width="3" height="2" fill="#444" />
        <rect x="107" y="110" width="3" height="2" fill="#444" />
        <rect x="111" y="110" width="3" height="2" fill="#444" />
        <rect x="87" y="113" width="3" height="2" fill="#444" />
        <rect x="91" y="113" width="3" height="2" fill="#444" />
        <rect x="95" y="113" width="3" height="2" fill="#444" />
        <rect x="99" y="113" width="3" height="2" fill="#444" />
        <rect x="103" y="113" width="3" height="2" fill="#444" />
        <rect x="107" y="113" width="3" height="2" fill="#444" />
        <rect x="111" y="113" width="3" height="2" fill="#444" />
        <rect x="89" y="116" width="22" height="2" fill="#444" />{" "}
        {/* 스페이스바 */}
        {/* 발 */}
        <ellipse
          cx="85"
          cy="175"
          rx="8"
          ry="5"
          fill="#6B8635"
          stroke="#5D7A2A"
          strokeWidth="1"
        />
        <ellipse
          cx="115"
          cy="175"
          rx="8"
          ry="5"
          fill="#6B8635"
          stroke="#5D7A2A"
          strokeWidth="1"
        />
        {/* 코딩 효과 (반짝반짝) */}
        <g className={animated ? "animate-pulse" : ""}>
          <text
            x="130"
            y="70"
            fill="#00F6FF"
            fontSize="12"
            className="font-mono"
          >
            {"</>"}
          </text>
          <text
            x="140"
            y="90"
            fill="#FF6B6B"
            fontSize="8"
            className="font-mono"
          >
            {"()"}
          </text>
          <text
            x="60"
            y="95"
            fill="#4ECDC4"
            fontSize="10"
            className="font-mono"
          >
            {"[]"}
          </text>
        </g>
      </svg>
    </div>
  );
};

export default NerdCharacter;
