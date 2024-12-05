import React from 'react';
import { Mineral } from '../../models/Mineral';

interface MineralsDisplayProps {
  minerals: Mineral[];
  onMineralClick: (id: number, value: number, image: string) => void;
}

const MineralsDisplay: React.FC<MineralsDisplayProps> = ({ minerals, onMineralClick }) => (
  <>
    {minerals.map((mineral) => (
      <div
        key={mineral.id}
        onPointerDown={() => onMineralClick(mineral.id, mineral.value, mineral.image)}
        style={{
          position: "absolute",
          left: mineral.x - 20,
          top: mineral.y - 5,
          width: mineral.radius * 2 + 15,
          height: mineral.radius * 2 + 15,
          cursor: "pointer",
          transform: `rotate(${mineral.rotation}deg)`,
          transition: "transform 0.1s",
          pointerEvents: "auto",
          touchAction: "manipulation",
        }}
      >
        <img
          src={mineral.image}
          alt=""
          className="w-full h-full object-contain"
        />
      </div>
    ))}
  </>
);

export default MineralsDisplay;
