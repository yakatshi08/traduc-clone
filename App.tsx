return (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
    {/* DEBUG INFO - TEMPORAIRE */}
    <div style={{
      position: 'fixed',
      top: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'yellow',
      color: 'black',
      padding: '10px 20px',
      zIndex: 9999,
      fontSize: '20px',
      fontWeight: 'bold'
    }}>
      ACTIVE TAB: {activeTab}
    </div>
    
    <Sidebar 
      isOpen={sidebarOpen} 
      onToggle={setSidebarOpen} 
      activeTab={activeTab} 
      onTabChange={handleTabChange} 
    />
    <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
      <Header />
      <main className="p-6 overflow-x-hidden">
        {/* AFFICHAGE DIRECT SANS SWITCH */}
        {activeTab === 'projects' ? (
          <div style={{ background: 'red', padding: '50px', color: 'white' }}>
            <h1>PROJECTS TAB IS ACTIVE!</h1>
            <Projects onNavigate={handleTabChange} />
          </div>
        ) : (
          <div style={{ background: 'blue', padding: '50px', color: 'white' }}>
            <h1>NOT ON PROJECTS - Current tab: {activeTab}</h1>
          </div>
        )}
      </main>
    </div>
  </div>
);