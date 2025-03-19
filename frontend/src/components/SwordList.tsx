// src/components/SwordList.tsx
import React, { useEffect, useState } from "react";
import { getSwords, Sword } from "../services/swordService";

const SwordList: React.FC = () => {
  const [swords, setSwords] = useState<Sword[]>([]);

  useEffect(() => {
    const fetchSwords = async () => {
      try {
        const data = await getSwords();
        setSwords(data);
      } catch (error) {
        console.error("Error fetching swords:", error);
      }
    };

    fetchSwords();
  }, []);

  return (
    <div>
      <h2>Sword Inventory</h2>
      <ul>
        {swords.map((sword) => (
          <li key={sword.id}>{sword.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default SwordList;
