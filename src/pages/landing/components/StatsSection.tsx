const StatsSection = () => (
    <section className="relative z-10 py-16 border-t border-cyber-blue/20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-2">
            <div className="text-3xl font-bold neon-text">10K+</div>
            <div className="text-gray-400">활성 사용자</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold neon-text">50K+</div>
            <div className="text-gray-400">완료된 대결</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold neon-text">500+</div>
            <div className="text-gray-400">문제 수</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold neon-text">24/7</div>
            <div className="text-gray-400">실시간 서비스</div>
          </div>
        </div>
      </div>
    </section>
  );
  
  export default StatsSection;