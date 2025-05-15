import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import MainContent from "./MainContent";
import Footer from "./Footer";
import RightSidebar from "./RightSidebar";
import PlayerBar from "./PlayerBar";

const HomePage = ({ 
  onShowLogin, 
  onShowRegister, 
  isAuthenticated, 
  isAdmin, 
  userName, 
  onLogout 
}) => (
  <div className="flex flex-col min-h-screen bg-black">
    <Navbar 
      onShowLogin={onShowLogin} 
      onShowRegister={onShowRegister} 
      isAuthenticated={isAuthenticated} 
      isAdmin={isAdmin}
      userName={userName}
      onLogout={onLogout} 
    />
    <div className="flex flex-1">
      <Sidebar />
      <MainContent />
      {isAuthenticated && <RightSidebar />}
    </div>
    <Footer />
    {isAuthenticated && <PlayerBar />}
  </div>
);

export default HomePage;