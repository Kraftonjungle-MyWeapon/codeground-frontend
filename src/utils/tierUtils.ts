
export type Tier = "bronze" | "silver" | "gold" | "platinum" | "diamond" | "challenger";

const tierDetails: Record<Tier, { name: string; color: string; badge: string }> = {
    bronze: { name: "BRONZE", color: "#cd7f32", badge: "/tiers/bronze.png" },
    silver: { name: "SILVER", color: "#c0c0c0", badge: "/tiers/silver.png" },
    gold: { name: "GOLD", color: "#ffd700", badge: "/tiers/gold.png" },
    platinum: { name: "PLATINUM", color: "#e5e4e2", badge: "/tiers/platinum.png" },
    diamond: { name: "DIAMOND", color: "#b9f2ff", badge: "/tiers/diamond.png" },
    challenger: { name: "CHALLENGER", color: "#ff4500", badge: "/tiers/challenger.png" },
};

export const getTierDetails = (tier: Tier) => {
    return tierDetails[tier] || tierDetails.bronze;
};
