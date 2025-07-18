export const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "bronze":
        return "text-orange-400";
      case "silver":
        return "text-gray-400";
      case "gold":
        return "text-yellow-400";
      case "platinum":
        return "text-blue-400";
      case "diamond":
        return "text-purple-400";
      default:
        return "text-white";
    }
  };
  
  export const getResultColor = (result: string | null | undefined) => {
    switch (result) {
      case "win":
        return "text-green-400";
      case "loss":
        return "text-red-400";
      case "draw":
      case null:
      case undefined:
      case "":
        return "text-gray-400";
      default:
        return "text-gray-400";
    }
  };
  
  export const getBadgeRarityColor = (rarity: string, completed: boolean) => {
    if (!completed) return "text-gray-500 bg-gray-800/50";
  
    switch (rarity) {
      case "common":
        return "text-gray-300 bg-gray-600/30";
      case "uncommon":
        return "text-green-400 bg-green-500/20";
      case "rare":
        return "text-blue-400 bg-blue-500/20";
      case "epic":
        return "text-purple-400 bg-purple-500/20";
      case "legendary":
        return "text-yellow-400 bg-yellow-500/20";
      default:
        return "text-gray-300 bg-gray-600/30";
    }
  };