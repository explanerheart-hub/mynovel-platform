const { useState, useEffect } = React;

const INITIAL_BOOKS = [
  {
    id: "1",
    title: "I Awakened a Creation System to Dominate the World",
    synopsis: "In a world devastated by the apocalypse, Lu Jie awakens an SSS-grade Creation System. With the power to build ultimate shelters and upgrade items infinitely, he begins his journey to absolute dominance.",
    cover: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60",
    tags: ["System", "Apocalypse", "Action"],
    rating: 5,
    ratingsCount: 1
  }
];

const INITIAL_CHAPTERS = [
  { id: "ch1", bookId: "1", number: 1, title: "The Doomsday Login", content: "The sky turned crimson. Thunder roared as the world as we knew it came to an end. Inside his tiny room, Lu Jie heard a mechanical voice: 'Ding! Global Freeze initiated. Syncing SSS-Grade Creation System with host...'\n\nEvery paragraph he read felt like a step into a new reality. He gripped his hands tightly, realizing that his fate had changed forever.", isLocked: false, price: 0, reward: 5 },
  { id: "ch2", bookId: "1", number: 2, title: "SSS-Grade Shelter Creation", content: "With the first wave of freeze hitting the city, Lu Jie didn't waste a single second. [System, upgrade this room to an Iron Fortress!] He commanded. A brilliant blue light enveloped the walls. Out side, people were screaming, but inside, it was warm as spring.", isLocked: true, price: 5, reward: 7 },
  { id: "ch3", bookId: "1", number: 3, title: "The First Conclave", content: "Word spread quickly about a warm sanctuary in sector 4. Powerful factions started moving. But Lu Jie was busy looking at his system screen. 'Next Level-up requirements: 10,000 Energy Points.' He smiled. It was time to hunt.", isLocked: true, price: 7, reward: 10 }
];

function App() {
  const [books, setBooks] = useState(INITIAL_BOOKS);
  const [chapters, setChapters] = useState(INITIAL_CHAPTERS);
  const [users, setUsers] = useState([
    { id: "admin", username: "Author / Owner", email: "admin.owner@myplatform.com", coins: 9999, unlockedChapters: ["ch1"] },
    { id: "u1", username: "Mansu Reader", email: "reader@test.com", coins: 10, unlockedChapters: ["ch1"] }
  ]);
  const [currentUser, setCurrentUser] = useState(null); 
  const [view, setView] = useState('home'); 
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);

  // Form & Admin States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const [newBookTitle, setNewBookTitle] = useState('');
  const [newBookSynopsis, setNewBookSynopsis] = useState('');
  const [newBookCover, setNewBookCover] = useState('');
  const [newBookTags, setNewBookTags] = useState('');
  const [newChNumber, setNewChNumber] = useState('');
  const [newChTitle, setNewChTitle] = useState('');
  const [newChContent, setNewChContent] = useState('');
  const [newChIsLocked, setNewChIsLocked] = useState(false);
  const [newChPrice, setNewChPrice] = useState(0);
  const [newChReward, setNewChReward] = useState(5);
  
  // Custom Feature States
  const [adminCoinTarget, setAdminCoinTarget] = useState('admin');
  const [coinModifyAmount, setCoinModifyAmount] = useState(0);
  const [salesLog, setSalesLog] = useState([
    { id: "s1", username: "Mansu Reader", title: "Chapter 2 Unlock", price: "5 Coins", time: "Just now" }
  ]);
  const [pendingNovels, setPendingNovels] = useState([
    { id: "p1", title: "Global Apocalypse Shelter", creator: "Himanshu_Write", synopsis: "Ice age apocalypse...", status: "pending" }
  ]);

  // Payment simulated states
  const [paymentPopup, setPaymentPopup] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('idle');

  const COIN_PACKS = [
    { id: "pack1", name: "Starter Pack", coins: 50, price: 49, icon: "fa-solid fa-coins text-amber-500" },
    { id: "pack2", name: "Popular Pack", coins: 120, price: 99, icon: "fa-solid fa-gem text-purple-400" },
    { id: "pack3", name: "Immortal Treasure", coins: 300, price: 199, icon: "fa-solid fa-dragon text-rose-500" }
  ];

  useEffect(() => {
    const storedBooks = localStorage.getItem('phone_books');
    const storedChapters = localStorage.getItem('phone_chapters');
    const storedUsers = localStorage.getItem('phone_users');
    const storedSales = localStorage.getItem('phone_sales');
    if (storedBooks) setBooks(JSON.parse(storedBooks));
    if (storedChapters) setChapters(JSON.parse(storedChapters));
    if (storedUsers) setUsers(JSON.parse(storedUsers));
    if (storedSales) setSalesLog(JSON.parse(storedSales));
  }, []);

  const saveToStorage = (b, c, u, s) => {
    localStorage.setItem('phone_books', JSON.stringify(b));
    localStorage.setItem('phone_chapters', JSON.stringify(c));
    localStorage.setItem('phone_users', JSON.stringify(u));
    localStorage.setItem('phone_sales', JSON.stringify(s));
  };

  const handleAuth = (e) => {
    e.preventDefault();
    if (isSignUp) {
      const newUser = { id: 'u_' + Date.now(), username: regUsername, email: regEmail, coins: 10, unlockedChapters: ["ch1"] };
      const updated = [...users, newUser]; setUsers(updated); setCurrentUser(newUser);
      saveToStorage(books, chapters, updated, salesLog); setView('home');
    } else {
      if (loginEmail === 'admin.owner@myplatform.com' && loginPassword === 'AdminSecurePassword2026') {
        const foundAdmin = users.find(u => u.id === 'admin') || { id: 'admin', username: 'Author / Owner', email: loginEmail, role: 'owner', coins: 9999 };
        setCurrentUser({ ...foundAdmin, role: 'owner' });
        setView('admin');
      } else {
        const found = users.find(u => u.email === loginEmail);
        if (found) { setCurrentUser(found); setView('home'); } else { alert("Invalid Credentials!"); }
      }
    }
  };

  const handleDeleteBook = (bookId, e) => {
    if (e) e.stopPropagation();
    if (!confirm("Are you sure you want to delete this novel permanently? All chapters will be lost!")) return;
    
    const updatedBooks = books.filter(b => b.id !== bookId);
    const updatedChapters = chapters.filter(c => c.bookId !== bookId);
    
    setBooks(updatedBooks);
    setChapters(updatedChapters);
    saveToStorage(updatedBooks, updatedChapters, users, salesLog);
    alert("Novel deleted successfully!");
    if (selectedBook && selectedBook.id === bookId) setView('home');
  };

  const handleModifyCoins = (actionType) => {
    const amount = parseInt(coinModifyAmount);
    if (!amount || amount <= 0) return alert("Please enter a valid amount!");

    const targetUser = users.find(u => u.id === adminCoinTarget);
    if (!targetUser) return alert("User not found!");

    let finalCoins = targetUser.coins || 0;
    if (actionType === 'ADD') finalCoins += amount;
    else if (actionType === 'DEDUCT') {
      if (finalCoins - amount < 0) return alert("Balance cannot be negative!");
      finalCoins -= amount;
    }

    const updatedUsers = users.map(u => u.id === adminCoinTarget ? { ...u, coins: finalCoins } : u);
    setUsers(updatedUsers);
    saveToStorage(books, chapters, updatedUsers, salesLog);
    
    if (currentUser && currentUser.id === adminCoinTarget) {
      setCurrentUser({ ...currentUser, coins: finalCoins });
    }
    
    alert(`Success! ${targetUser.username} new balance: ${finalCoins} Coins`);
    setCoinModifyAmount(0);
  };

  const handleApproveNovel = (novelId) => {
    const novelToApprove = pendingNovels.find(n => n.id === novelId);
    if (novelToApprove) {
      const newLiveBook = { id: 'b_' + Date.now(), title: novelToApprove.title, synopsis: novelToApprove.synopsis, cover: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500", tags: ["Apocalypse", "System"], rating: 5, ratingsCount: 0 };
      const updatedBooks = [...books, newLiveBook]; setBooks(updatedBooks);
      setPendingNovels(pendingNovels.filter(n => n.id !== novelId));
      saveToStorage(updatedBooks, chapters, users, salesLog);
      alert("Creator novel is now live!");
    }
  };

  const handleStartPayment = (pack) => {
    if (!currentUser) return setView('login');
    setPaymentPopup(pack);
    setPaymentStatus('idle');
  };

  const handleProcessPayment = () => {
    setPaymentStatus('processing');
    setTimeout(() => {
      setPaymentStatus('success');
      setTimeout(() => {
        const updatedCoins = (currentUser.coins || 0) + paymentPopup.coins;
        const updatedUser = { ...currentUser, coins: updatedCoins };
        setCurrentUser(updatedUser);

        const updatedUsers = users.map(u => u.id === currentUser.id ? updatedUser : u);
        setUsers(updatedUsers);
        
        const newLog = { id: 's_' + Date.now(), username: currentUser.username, title: `Bought ${paymentPopup.name}`, price: `INR ${paymentPopup.price}`, time: "Just now" };
        const updatedSales = [newLog, ...salesLog];
        setSalesLog(updatedSales);

        saveToStorage(books, chapters, updatedUsers, updatedSales);
        setPaymentPopup(null); setPaymentStatus('idle');
        alert(`Payment Successful! +${paymentPopup.coins} Coins credited.`);
      }, 1500);
    }, 2000);
  };

  const handleUnlockChapter = (ch) => {
    if (!currentUser) return setView('login');
    if (currentUser.coins >= ch.price) {
      const updatedUser = { ...currentUser, coins: currentUser.coins - ch.price, unlockedChapters: [...(currentUser.unlockedChapters || []), ch.id] };
      setCurrentUser(updatedUser);
      const updatedUsers = users.map(u => u.id === currentUser.id ? updatedUser : u);
      setUsers(updatedUsers);
      
      const newSale = { id: 's_' + Date.now(), username: currentUser.username, title: `Unlocked CH ${ch.number}`, price: `${ch.price} Coins`, time: "Just now" };
      const updatedSales = [newSale, ...salesLog];
      setSalesLog(updatedSales);

      saveToStorage(books, chapters, updatedUsers, updatedSales);
      setSelectedChapter(ch); setView('reader');
    } else { 
      alert("Insufficient coins! Redirecting to Coin Shop.");
      setView('coin-shop');
    }
  };

  const handleCreateBook = (e) => {
    e.preventDefault();
    const nBook = { id: 'b_' + Date.now(), title: newBookTitle, synopsis: newBookSynopsis, cover: newBookCover || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500", tags: newBookTags.split(','), rating: 5, ratingsCount: 0 };
    const updated = [...books, nBook]; setBooks(updated); saveToStorage(updated, chapters, users, salesLog);
    alert("Novel Published!"); setNewBookTitle(''); setNewBookSynopsis('');
  };

  const handleCreateChapter = (e) => {
    e.preventDefault();
    if (!selectedBook) return alert("Select a book!");
    const nCh = { id: 'ch_' + Date.now(), bookId: selectedBook.id, number: parseInt(newChNumber), title: newChTitle, content: newChContent, isLocked: newChIsLocked, price: newChIsLocked ? parseInt(newChPrice) : 0, reward: parseInt(newChReward) };
    const updated = [...chapters, nCh].sort((a,b) => a.number - b.number);
    setChapters(updated); saveToStorage(books, updated, users, salesLog);
    alert("Chapter Added!"); setNewChNumber(''); setNewChTitle(''); setNewChContent('');
  };

  const handleChapterComplete = (ch) => {
    if (!currentUser || currentUser.id === 'admin') return;
    const updatedUser = { ...currentUser, coins: (currentUser.coins || 0) + ch.reward };
    setCurrentUser(updatedUser);
    const updatedUsers = users.map(u => u.id === currentUser.id ? updatedUser : u);
    setUsers(updatedUsers); saveToStorage(books, chapters, updatedUsers, salesLog);
    alert(`Success! Earned ${ch.reward} Coins.`);
  };

  return (
    <div className="min-h-screen bg-[#07070a] text-gray-100 font-sans pb-12 antialiased selection:bg-purple-500/30">
      {/* Navigation */}
      <nav className="bg-[#0f0f16]/90 backdrop-blur-md px-4 py-3 flex justify-between items-center border-b border-purple-900/30 sticky top-0 z-40 shadow-xl shadow-black/20">
        <div className="font-black text-xl bg-gradient-to-r from-purple-500 to-indigo-400 bg-clip-text text-transparent flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}>
          <i className="fa-solid fa-bolt-lightning text-purple-500"></i> VIBENOVEL
        </div>
        <div className="flex items-center gap-3 text-xs">
          <button onClick={() => setView('coin-shop')} className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3 py-1.5 rounded-full font-bold flex items-center gap-1 transition-all">
            <i className="fa-solid fa-coins text-amber-500"></i> Shop
          </button>
          {currentUser?.role === 'owner' && (
            <button onClick={() => setView('admin')} className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-xl font-bold shadow-lg shadow-purple-600/20 transition-all">
              Studio Dashboard
            </button>
          )}
          {currentUser ? (
            <div className="flex items-center gap-3 bg-[#161622] px-3 py-1.5 rounded-xl border border-gray-800">
              <span className="text-gray-300 font-medium">{currentUser.username}</span>
              <span className="text-amber-400 font-black">🪙 {currentUser.coins || 0}</span>
              <button onClick={() => { setCurrentUser(null); setView('home'); }} className="text-rose-500 hover:text-rose-400 transition-colors"><i className="fa-solid fa-arrow-right-from-bracket"></i></button>
            </div>
          ) : (
            <button onClick={() => setView('login')} className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-1.5 rounded-xl font-bold hover:opacity-90 transition-all">Login</button>
          )}
        </div>
      </nav>

      <main className="p-4 max-w-xl mx-auto">
        {/* Home Screen */}
        {view === 'home' && (
          <div className="space-y-5">
            <div className="flex justify-between items-center border-b border-purple-900/20 pb-2">
              <h2 className="text-purple-400 font-black text-xs uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-3 bg-purple-500 rounded-full inline-block"></span> Hot Manhua & Novels
              </h2>
            </div>
            {books.map(b => (
              <div key={b.id} onClick={() => { setSelectedBook(b); setView('book-details'); }} className="bg-[#0f0f16] p-3 rounded-2xl border border-purple-900/10 flex gap-4 cursor-pointer hover:border-purple-500/40 hover:scale-[1.01] transition-all shadow-xl shadow-black/40 group relative">
                <img src={b.cover} className="w-24 h-32 object-cover rounded-xl shadow-lg border border-gray-800/50" />
                <div className="flex flex-col justify-between py-1 flex-1">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-white text-sm group-hover:text-purple-400 transition-colors line-clamp-1">{b.title}</h3>
                      {currentUser?.role === 'owner' && (
                        <button onClick={(e) => handleDeleteBook(b.id, e)} className="text-rose-500 hover:text-rose-400 text-xs p-1.5 z-10 rounded-lg hover:bg-rose-950/30 transition-all" title="Delete Permanently">
                          <i className="fa-solid fa-trash-can"></i>
                        </button>
                      )}
                    </div>
                    <p className="text-gray-400 text-xs line-clamp-3 mt-1.5 leading-relaxed">{b.synopsis}</p>
                  </div>
                  <div className="flex gap-1.5 mt-3">
                    {b.tags.map((t, idx)=><span key={idx} className="bg-purple-950/40 text-purple-400 border border-purple-800/30 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider">{t}</span>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Book Details */}
        {view === 'book-details' && selectedBook && (
          <div className="space-y-5 animate-fade-in">
            <div className="flex justify-between items-center">
              <button onClick={() => setView('home')} className="text-xs text-gray-400 hover:text-white transition-colors">&larr; Back to Platform</button>
              {currentUser?.role === 'owner' && (
                <button onClick={() => handleDeleteBook(selectedBook.id)} className="bg-rose-950/60 text-rose-400 border border-rose-900/50 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-rose-900/50 transition-all">
                  Delete Entire Novel
                </button>
              )}
            </div>
            <div className="bg-[#0f0f16] p-5 rounded-3xl border border-purple-900/10 text-center shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-purple-600/5 to-transparent pointer-events-none"></div>
              <img src={selectedBook.cover} className="w-32 h-44 object-cover mx-auto rounded-2xl shadow-2xl border border-purple-900/20" />
              <h2 className="font-black text-white mt-4 text-base tracking-wide">{selectedBook.title}</h2>
              <p className="text-xs text-gray-400 mt-2 text-left leading-relaxed bg-[#0a0a0f] p-3 rounded-xl border border-gray-900">{selectedBook.synopsis}</p>
            </div>
            <div className="bg-[#0f0f16] p-4 rounded-3xl border border-purple-900/10 shadow-2xl">
              <h3 className="text-xs font-black text-purple-400 mb-3 uppercase tracking-widest">Chapters Directory</h3>
              <div className="space-y-2">
                {chapters.filter(c => c.bookId === selectedBook.id).map(ch => {
                  const isUnlocked = !ch.isLocked || currentUser?.id === 'admin' || currentUser?.unlockedChapters?.includes(ch.id);
                  return (
                    <div key={ch.id} className="p-3 bg-[#13131c] rounded-xl border border-purple-900/5 flex justify-between items-center text-xs hover:border-purple-500/20 transition-all">
                      <span className="font-semibold text-gray-300">Chapter {ch.number}: {ch.title}</span>
                      {isUnlocked ? (
                        <button onClick={() => { setSelectedChapter(ch); setView('reader'); }} className="bg-purple-600 hover:bg-purple-700 px-4 py-1.5 rounded-lg font-bold shadow-md shadow-purple-600/10 text-white transition-all">Read</button>
                      ) : (
                        <button onClick={() => handleUnlockChapter(ch)} className="bg-gradient-to-r from-amber-500 to-yellow-500 text-black px-3 py-1.5 rounded-lg font-black shadow-md shadow-amber-500/10 flex items-center gap-1 transition-all hover:opacity-90">
                          Unlock ({ch.price} 🪙)
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Reader View */}
        {view === 'reader' && selectedChapter && (
          <div className="space-y-4 animate-fade-in">
            <button onClick={() => setView('book-details')} className="text-xs text-gray-400 hover:text-white transition-colors">&larr; Novel Index</button>
            <div className="bg-[#0f0f16] p-6 rounded-3xl border border-purple-900/20 shadow-2xl">
              <h1 className="text-center font-black text-white text-base border-b border-purple-900/10 pb-4 tracking-wide">Chapter {selectedChapter.number}: {selectedChapter.title}</h1>
              <div className="text-gray-300 text-sm leading-8 my-6 p-4 bg-[#07070a] rounded-2xl border-l-4 border-purple-500 whitespace-pre-line tracking-wide font-normal">
                {selectedChapter.content}
              </div>
              <button onClick={() => handleChapterComplete(selectedChapter)} className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-black p-3 rounded-2xl text-xs shadow-xl shadow-amber-500/10 uppercase tracking-widest hover:opacity-90 transition-all">
                Mark Finished &amp; Claim Coins
              </button>
            </div>
          </div>
        )}

        {/* Coin Shop */}
        {view === 'coin-shop' && (
          <div className="space-y-4 animate-fade-in">
            <button onClick={() => setView('home')} className="text-xs text-gray-400 hover:text-white transition-colors">&larr; Close Shop</button>
            <div className="text-center bg-gradient-to-br from-purple-900/20 via-indigo-950/10 to-transparent p-6 rounded-3xl border border-purple-500/20 shadow-2xl">
              <h2 className="text-xl font-black text-white tracking-wider">🪙 PREMIUM COIN SHOP</h2>
              <p className="text-xs text-gray-400 mt-1.5">Unlock chapters instantly and support creators directly</p>
            </div>
            <div className="space-y-3">
              {COIN_PACKS.map(pack => (
                <div key={pack.id} className="bg-[#0f0f16] p-4 rounded-2xl border border-purple-900/10 flex justify-between items-center shadow-xl hover:border-purple-500/20 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#14141f] border border-gray-800 rounded-xl flex items-center justify-center text-xl shadow-inner">
                      <i className={pack.icon}></i>
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">{pack.name}</h3>
                      <p className="text-xs text-amber-400 font-black mt-0.5">+{pack.coins} Coins Premium Pack</p>
                    </div>
                  </div>
                  <button onClick={() => handleStartPayment(pack)} className="bg-purple-600 hover:bg-purple-700 text-white font-black px-5 py-2.5 rounded-xl text-xs shadow-lg shadow-purple-600/20 transition-all">
                    INR {pack.price}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Master Control Admin Dashboard */}
        {view === 'admin' && currentUser?.role === 'owner' && (
          <div className="space-y-6 text-xs animate-fade-in">
            <button onClick={() => setView('home')} className="text-xs text-gray-400 hover:text-white transition-colors">&larr; Return to Platform</button>
            
            {/* Dedicated Coin Controller Menu */}
            <div className="bg-[#11111a] p-5 rounded-3xl border border-amber-500/20 shadow-2xl space-y-4">
              <h2 className="text-sm font-black text-amber-400 flex items-center gap-2 uppercase tracking-widest">
                <i className="fa-solid fa-wand-magic-sparkles text-amber-500"></i> Vault Coin Distribution
              </h2>
              <div className="space-y-1.5">
                <label className="text-gray-400 block text-[11px] font-bold">Select User Target Wallet</label>
                <select 
                  value={adminCoinTarget} 
                  onChange={e => setAdminCoinTarget(e.target.value)}
                  className="w-full bg-[#0a0a0f] border border-gray-800 p-2.5 rounded-xl text-white font-bold outline-none focus:border-amber-500/50 transition-colors"
                >
                  {users.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.id === 'admin' ? "👑 [Self Account] Admin / Owner" : `${u.username} (${u.email})`} &mdash; [Current Balance: {u.coins || 0} Coins]
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  placeholder="Amount" 
                  value={coinModifyAmount || ''} 
                  onChange={e => setCoinModifyAmount(e.target.value)} 
                  className="w-24 bg-[#0a0a0f] border border-gray-800 p-2.5 rounded-xl text-white text-center font-black outline-none focus:border-amber-500/50" 
                />
                <button onClick={() => handleModifyCoins('ADD')} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl shadow-lg shadow-emerald-600/10 transition-all">
                  + Issue Coins
                </button>
                <button onClick={() => handleModifyCoins('DEDUCT')} className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 rounded-xl shadow-lg shadow-rose-600/10 transition-all">
                  - Remove Coins
                </button>
              </div>
            </div>

            {/* Bought / Sold Ledger Platform History */}
            <div className="bg-[#0f0f16] p-5 rounded-3xl border border-purple-900/10 shadow-2xl space-y-3">
              <h2 className="text-sm font-black text-purple-400 flex items-center gap-2 uppercase tracking-widest">
                <i className="fa-solid fa-receipt"></i> Store Transaction History Ledger
              </h2>
              <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
                {salesLog.length === 0 ? (
                  <p className="text-gray-500 italic text-[11px] text-center py-4">No recent purchases or unlocks logged.</p>
                ) : (
                  salesLog.map(log => (
                    <div key={log.id} className="p-3 bg-[#14141f] rounded-xl border border-purple-900/5 flex justify-between items-center shadow-inner">
                      <div>
                        <p className="text-white font-bold">{log.username}</p>
                        <p className="text-gray-400 text-[10px] mt-0.5">{log.title}</p>
                      </div>
                      <span className="text-emerald-400 font-black bg-emerald-950/20 border border-emerald-900/30 px-3 py-1 rounded-lg">
                        {log.price}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Creator Approval List */}
            <div className="bg-[#0f0f16] p-5 rounded-3xl border border-purple-900/10 shadow-2xl space-y-3">
              <h3 className="text-xs font-black text-purple-400 uppercase tracking-widest"><i className="fa-solid fa-file-shield"></i> Creator Submission Queue ({pendingNovels.length})</h3>
              {pendingNovels.map(pn => (
                <div key={pn.id} className="p-3 bg-[#14141f] border border-gray-800 rounded-xl flex justify-between items-center shadow-inner">
                  <span className="font-bold text-white text-xs">{pn.title} <span className="text-gray-500 font-normal">by @{pn.creator}</span></span>
                  <button onClick={() => handleApproveNovel(pn.id)} className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg text-[10px] font-black shadow transition-all">Approve</button>
                </div>
              ))}
            </div>

            {/* Publishing forms */}
            <div className="bg-[#0f0f16] p-4 rounded-3xl border border-purple-900/10 space-y-2 shadow-2xl">
              <h2 className="font-bold text-purple-400 text-sm">Publish New Master Novel</h2>
              <input type="text" placeholder="Title" value={newBookTitle} onChange={e=>setNewBookTitle(e.target.value)} className="w-full bg-[#14141f] p-2.5 rounded-xl text-white outline-none border border-gray-800" />
              <textarea placeholder="Synopsis" value={newBookSynopsis} onChange={e=>setNewBookSynopsis(e.target.value)} className="w-full bg-[#14141f] p-2.5 rounded-xl text-white resize-none border border-gray-800 h-20" />
              <input type="text" placeholder="Tags (Comma separated)" value={newBookTags} onChange={e=>setNewBookTags(e.target.value)} className="w-full bg-[#14141f] p-2.5 rounded-xl text-white outline-none border border-gray-800" />
              <button onClick={handleCreateBook} className="bg-purple-600 w-full p-2.5 rounded-xl font-bold mt-1 shadow-lg text-white">Publish Live</button>
            </div>

            <div className="bg-[#0f0f16] p-4 rounded-3xl border border-purple-900/10 space-y-2 shadow-2xl">
              <h2 className="font-bold text-indigo-400 text-sm">Upload Novel Chapter</h2>
              <select onChange={e=>setSelectedBook(books.find(b=>b.id===e.target.value))} className="w-full bg-[#14141f] p-2.5 rounded-xl text-white outline-none border border-gray-800 font-medium">
                <option value="">-- Select Target Book --</option>
                {books.map(b=><option key={b.id} value={b.id}>{b.title}</option>)}
              </select>
              <input type="number" placeholder="Chapter Number" value={newChNumber} onChange={e=>setNewChNumber(e.target.value)} className="w-full bg-[#14141f] p-2.5 rounded-xl text-white outline-none border border-gray-800" />
              <input type="text" placeholder="Chapter Title" value={newChTitle} onChange={e=>setNewChTitle(e.target.value)} className="w-full bg-[#14141f] p-2.5 rounded-xl text-white outline-none border border-gray-800" />
              <textarea placeholder="Content Script" value={newChContent} onChange={e=>setNewChContent(e.target.value)} className="w-full bg-[#14141f] p-2.5 rounded-xl text-white resize-none border border-gray-800 h-24" />
              <div className="flex justify-between items-center p-1.5 text-gray-300 font-medium"><span>Lock Chapter with Premium coins?</span><input type="checkbox" checked={newChIsLocked} onChange={e=>setNewChIsLocked(e.target.checked)} /></div>
              {newChIsLocked && <input type="number" placeholder="Price (Coins)" value={newChPrice} onChange={e=>setNewChPrice(e.target.value)} className="w-full bg-[#14141f] p-2.5 rounded-xl text-white outline-none border border-gray-800" />}
              <input type="number" placeholder="Read Completion Reward Coins" value={newChReward} onChange={e=>setNewChReward(e.target.value)} className="w-full bg-[#14141f] p-2.5 rounded-xl text-white outline-none border border-gray-800" />
              <button onClick={handleCreateChapter} className="bg-indigo-600 w-full p-2.5 rounded-xl font-bold mt-1 shadow-lg text-white">Add Chapter</button>
            </div>
          </div>
        )}

        {/* Auth Screen */}
        {view === 'login' && (
          <div className="bg-[#0f0f16] p-6 rounded-3xl border border-purple-900/10 shadow-2xl space-y-4 text-xs animate-fade-in">
            <h2 className="text-center font-black text-white text-base tracking-wide">{isSignUp ? "Create Account" : "Access Terminal"}</h2>
            <form onSubmit={handleAuth} className="space-y-2.5">
              {isSignUp && <input type="text" placeholder="Username" value={regUsername} onChange={e=>setRegUsername(e.target.value)} className="w-full bg-[#14141f] p-3 rounded-xl text-white border border-gray-800 outline-none" />}
              <input type="email" placeholder="Email Address" value={isSignUp ? regEmail : loginEmail} onChange={e=>isSignUp ? setRegEmail(e.target.value) : setLoginEmail(e.target.value)} className="w-full bg-[#14141f] p-3 rounded-xl text-white border border-gray-800 outline-none" />
              <input type="password" placeholder="Password" value={isSignUp ? regPassword : loginPassword} onChange={e=>isSignUp ? setRegPassword(e.target.value) : setLoginPassword(e.target.value)} className="w-full bg-[#14141f] p-3 rounded-xl text-white border border-gray-800 outline-none" />
              <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-3 rounded-xl font-black mt-2 text-xs shadow-lg uppercase tracking-wider">{isSignUp ? "Register Account" : "Sign In"}</button>
            </form>
            <button onClick={() => setIsSignUp(!isSignUp)} className="text-purple-400 block mx-auto mt-3 font-semibold text-[11px]">
              {isSignUp ? "Already have an account? Sign In" : "New creator or reader? Sign Up Now"}
            </button>
          </div>
        )}
      </main>

      {/* Professional Razorpay Simulated Overlay Popup */}
      {paymentPopup && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-50 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0f0f16] border border-purple-500/20 w-full max-w-xs rounded-3xl p-5 shadow-2xl space-y-4 text-center relative overflow-hidden">
            <div className="flex justify-between items-center border-b border-purple-900/10 pb-2.5">
              <span className="text-purple-400 font-black text-[10px] tracking-widest flex items-center gap-1"><i className="fa-solid fa-shield-halved"></i> SECURE RAZORPAY TERMINAL</span>
              <button onClick={() => setPaymentPopup(null)} className="text-gray-500 hover:text-white text-sm transition-colors">&times;</button>
            </div>

            {paymentStatus === 'idle' && (
              <div className="space-y-4 py-1 animate-fade-in">
                <div>
                  <h3 className="text-white font-black text-sm tracking-wide">{paymentPopup.name}</h3>
                  <p className="text-[11px] text-gray-400 mt-1">Total Due Amount: <span className="text-emerald-400 font-extrabold">INR {paymentPopup.price}.00</span></p>
                </div>
                <div className="p-3 bg-[#14141f] rounded-xl border border-purple-900/5 flex justify-between items-center text-xs">
                  <span className="text-gray-400 font-medium">Credits Unlocking:</span>
                  <span className="text-amber-400 font-black flex items-center gap-0.5">🪙 {paymentPopup.coins} Pack</span>
                </div>
                <button onClick={handleProcessPayment} className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black py-3 rounded-xl text-xs shadow-xl shadow-emerald-600/10 uppercase tracking-wider hover:opacity-95 transition-all">
                  Proceed To Pay (Simulated)
                </button>
              </div>
            )}

            {paymentStatus === 'processing' && (
              <div className="py-6 space-y-3 animate-fade-in">
                <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-[11px] text-gray-400 tracking-wide">Securing connection with payment server...</p>
              </div>
            )}

            {paymentStatus === 'success' && (
              <div className="py-6 space-y-2.5 animate-fade-in">
                <div className="w-12 h-12 bg-emerald-950/40 text-emerald-400 rounded-full flex items-center justify-center text-xl mx-auto border border-emerald-500/30 shadow-xl shadow-emerald-900/20">
                  <i className="fa-solid fa-circle-check"></i>
                </div>
                <p className="text-sm font-black text-white tracking-wide">Transaction Approved Successfully!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
