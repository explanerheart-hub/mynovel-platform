const { useState, useEffect } = React;

// शुरुआती डमी डेटा (ताकि वेबसाइट खाली न दिखे)
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
  const [users, setUsers] = useState([{ id: "u1", username: "Mansu Reader", email: "reader@test.com", coins: 0, unlockedChapters: ["ch1"] }]);
  const [comments, setComments] = useState([{ id: "c1", chapterId: "ch1", username: "Mansu Reader", text: "What an epic start!", timestamp: "2 mins ago" }]);
  const [currentUser, setCurrentUser] = useState(null); 
  const [view, setView] = useState('home'); 
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);

  // फॉर्म स्टेट्स
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [commentText, setCommentText] = useState('');

  // एडमिन फॉर्म स्टेट्स
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

  useEffect(() => {
    const storedBooks = localStorage.getItem('phone_books');
    const storedChapters = localStorage.getItem('phone_chapters');
    const storedUsers = localStorage.getItem('phone_users');
    const storedComments = localStorage.getItem('phone_comments');
    if (storedBooks) setBooks(JSON.parse(storedBooks));
    if (storedChapters) setChapters(JSON.parse(storedChapters));
    if (storedUsers) setUsers(JSON.parse(storedUsers));
    if (storedComments) setComments(JSON.parse(storedComments));
  }, []);

  const saveToStorage = (b, c, u, comm) => {
    localStorage.setItem('phone_books', JSON.stringify(b));
    localStorage.setItem('phone_chapters', JSON.stringify(c));
    localStorage.setItem('phone_users', JSON.stringify(u));
    localStorage.setItem('phone_comments', JSON.stringify(comm));
  };

  const handleAuth = (e) => {
    e.preventDefault();
    if (isSignUp) {
      const newUser = { id: 'u_' + Date.now(), username: regUsername, email: regEmail, coins: 0, unlockedChapters: ["ch1"] };
      const updated = [...users, newUser]; setUsers(updated); setCurrentUser(newUser);
      saveToStorage(books, chapters, updated, comments); setView('home');
    } else {
      if (loginEmail === 'admin.owner@myplatform.com' && loginPassword === 'AdminSecurePassword2026') {
        setCurrentUser({ id: 'admin', username: 'Author / Owner', email: loginEmail, role: 'owner' });
        setView('admin');
      } else {
        const found = users.find(u => u.email === loginEmail);
        if (found) { setCurrentUser(found); setView('home'); } else { alert("Invalid Credentials!"); }
      }
    }
  };

  const handleCreateBook = (e) => {
    e.preventDefault();
    const nBook = { id: 'b_' + Date.now(), title: newBookTitle, synopsis: newBookSynopsis, cover: newBookCover || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60", tags: newBookTags.split(','), rating: 5, ratingsCount: 0 };
    const updated = [...books, nBook]; setBooks(updated); saveToStorage(updated, chapters, users, comments);
    alert("Book Published!"); setNewBookTitle(''); setNewBookSynopsis('');
  };

  const handleCreateChapter = (e) => {
    e.preventDefault();
    if (!selectedBook) return alert("Select a book!");
    const nCh = { id: 'ch_' + Date.now(), bookId: selectedBook.id, number: parseInt(newChNumber), title: newChTitle, content: newChContent, isLocked: newChIsLocked, price: newChIsLocked ? parseInt(newChPrice) : 0, reward: parseInt(newChReward) };
    const updated = [...chapters, nCh].sort((a,b) => a.number - b.number);
    setChapters(updated); saveToStorage(books, updated, users, comments);
    alert("Chapter Added!"); setNewChNumber(''); setNewChTitle(''); setNewChContent('');
  };

  const handleUnlockChapter = (ch) => {
    if (!currentUser) { setView('login'); return; }
    if (currentUser.coins >= ch.price) {
      const updatedUser = { ...currentUser, coins: currentUser.coins - ch.price, unlockedChapters: [...(currentUser.unlockedChapters || []), ch.id] };
      setCurrentUser(updatedUser);
      const updatedUsers = users.map(u => u.id === currentUser.id ? updatedUser : u);
      setUsers(updatedUsers); saveToStorage(books, chapters, updatedUsers, comments);
      setSelectedChapter(ch); setView('reader');
    } else { alert("Not enough coins!"); }
  };

  const handleChapterComplete = (ch) => {
    if (!currentUser || currentUser.role === 'owner') return;
    const updatedUser = { ...currentUser, coins: currentUser.coins + ch.reward };
    setCurrentUser(updatedUser);
    const updatedUsers = users.map(u => u.id === currentUser.id ? updatedUser : u);
    setUsers(updatedUsers); saveToStorage(books, chapters, updatedUsers, comments);
    alert(`🎉 Earned ${ch.reward} Coins!`);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-gray-200">
      <nav className="bg-[#121212] p-4 flex justify-between items-center border-b border-gray-800">
        <div className="font-black text-purple-500 text-lg flex items-center gap-2" onClick={() => setView('home')}>
          <i className="fa-solid fa-book-open"></i> MYNOVEL
        </div>
        <div className="flex gap-2 text-xs">
          {currentUser?.role === 'owner' && <button onClick={() => setView('admin')} className="bg-purple-900 p-2 rounded">Studio</button>}
          {currentUser ? (
            <div className="flex items-center gap-2">
              {currentUser.role !== 'owner' && <span className="text-amber-400">🪙 {currentUser.coins}</span>}
              <button onClick={() => { setCurrentUser(null); setView('home'); }} className="text-red-400"><i className="fa-solid fa-sign-out"></i></button>
            </div>
          ) : (
            <button onClick={() => setView('login')} className="bg-purple-600 p-2 rounded">Login</button>
          )}
        </div>
      </nav>

      <main className="p-4 max-w-xl mx-auto">
        {view === 'home' && (
          <div className="space-y-4">
            <h2 className="text-purple-400 font-bold border-l-4 border-purple-600 pl-2">Trending Novels</h2>
            {books.map(b => (
              <div key={b.id} onClick={() => { setSelectedBook(b); setView('book-details'); }} className="bg-[#121212] p-3 rounded-xl border border-gray-800 flex gap-3">
                <img src={b.cover} className="w-24 h-32 object-cover rounded" />
                <div>
                  <h3 className="font-bold text-white text-sm">{b.title}</h3>
                  <p className="text-gray-400 text-xs line-clamp-3 mt-1">{b.synopsis}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {view === 'book-details' && selectedBook && (
          <div className="space-y-4">
            <button onClick={() => setView('home')} className="text-xs text-gray-400">&larr; Back</button>
            <div className="bg-[#121212] p-4 rounded-xl border border-gray-800 text-center">
              <img src={selectedBook.cover} className="w-32 h-44 object-cover mx-auto rounded" />
              <h2 className="font-black text-white mt-2 text-base">{selectedBook.title}</h2>
              <p className="text-xs text-gray-400 mt-2 text-left">{selectedBook.synopsis}</p>
            </div>
            <div className="bg-[#121212] p-4 rounded-xl border border-gray-800">
              <h3 className="text-xs font-bold text-gray-400 mb-2">Chapters List</h3>
              <div className="space-y-2">
                {chapters.filter(c => c.bookId === selectedBook.id).map(ch => {
                  const isUnlocked = !ch.isLocked || currentUser?.role === 'owner' || currentUser?.unlockedChapters?.includes(ch.id);
                  return (
                    <div key={ch.id} className="p-2 bg-[#181818] rounded flex justify-between items-center text-xs">
                      <span>CH {ch.number}: {ch.title}</span>
                      {isUnlocked ? (
                        <button onClick={() => { setSelectedChapter(ch); setView('reader'); }} className="bg-purple-600 px-2 py-1 rounded">Read</button>
                      ) : (
                        <button onClick={() => handleUnlockChapter(ch)} className="bg-amber-600 text-black px-2 py-1 rounded font-bold">Unlock ({ch.price} 🪙)</button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {view === 'reader' && selectedChapter && (
          <div className="space-y-4">
            <button onClick={() => setView('book-details')} className="text-xs text-gray-400">&larr; Chapters</button>
            <div className="bg-[#111] p-5 rounded-xl border border-purple-900/50">
              <h1 className="text-center font-bold text-white text-lg">{selectedChapter.title}</h1>
              {/* होरिजॉन्टल ओरिएंटेड लुक */}
              <div className="text-gray-300 text-sm leading-relaxed my-4 p-3 bg-[#151515] rounded border-l-2 border-purple-500 overflow-x-auto">
                {selectedChapter.content}
              </div>
              <button onClick={() => handleChapterComplete(selectedChapter)} className="w-full bg-amber-500 text-black font-bold p-2 rounded text-xs">
                Mark Read &amp; Claim 🪙
              </button>
            </div>
          </div>
        )}

        {view === 'admin' && currentUser?.role === 'owner' && (
          <div className="space-y-4 text-xs">
            <h1 className="text-purple-400 font-bold text-sm">Creator Studio (Owner Only)</h1>
            <div className="bg-[#121212] p-4 rounded-xl border border-gray-800 space-y-2">
              <h2 className="font-bold">Publish Novel</h2>
              <input type="text" placeholder="Title" value={newBookTitle} onChange={e=>setNewBookTitle(e.target.value)} className="w-full bg-[#181818] p-2 rounded" />
              <textarea placeholder="Synopsis" value={newBookSynopsis} onChange={e=>setNewBookSynopsis(e.target.value)} className="w-full bg-[#181818] p-2 rounded resize-none" />
              <input type="text" placeholder="Tags (Comma separated)" value={newBookTags} onChange={e=>setNewBookTags(e.target.value)} className="w-full bg-[#181818] p-2 rounded" />
              <button onClick={handleCreateBook} className="bg-purple-600 w-full p-2 rounded font-bold">Publish</button>
            </div>

            <div className="bg-[#121212] p-4 rounded-xl border border-gray-800 space-y-2">
              <h2 className="font-bold">Upload Chapter</h2>
              <select onChange={e=>setSelectedBook(books.find(b=>b.id===e.target.value))} className="w-full bg-[#181818] p-2 rounded text-white">
                <option value="">-- Select Book --</option>
                {books.map(b=><option key={b.id} value={b.id}>{b.title}</option>)}
              </select>
              <input type="number" placeholder="Ch Number" value={newChNumber} onChange={e=>setNewChNumber(e.target.value)} className="w-full bg-[#181818] p-2 rounded" />
              <input type="text" placeholder="Ch Title" value={newChTitle} onChange={e=>setNewChTitle(e.target.value)} className="w-full bg-[#181818] p-2 rounded" />
              <textarea placeholder="Content" value={newChContent} onChange={e=>setNewChContent(e.target.value)} className="w-full bg-[#181818] p-2 rounded resize-none" />
              <div className="flex justify-between p-1">
                <span>Lock Chapter?</span>
                <input type="checkbox" checked={newChIsLocked} onChange={e=>setNewChIsLocked(e.target.checked)} />
              </div>
              {newChIsLocked && <input type="number" placeholder="Price (Coins)" value={newChPrice} onChange={e=>setNewChPrice(e.target.value)} className="w-full bg-[#181818] p-2 rounded" />}
              <input type="number" placeholder="Reward Coins" value={newChReward} onChange={e=>setNewChReward(e.target.value)} className="w-full bg-[#181818] p-2 rounded" />
              <button onClick={handleCreateChapter} className="bg-blue-600 w-full p-2 rounded font-bold">Add Chapter</button>
            </div>
          </div>
        )}

        {view === 'login' && (
          <div className="bg-[#121212] p-5 rounded-xl border border-gray-800 space-y-3 text-xs">
            <h2 className="text-center font-bold text-white text-sm">{isSignUp ? "Sign Up" : "Login"}</h2>
            <form onSubmit={handleAuth} className="space-y-2">
              {isSignUp && <input type="text" placeholder="Username" value={regUsername} onChange={e=>setRegUsername(e.target.value)} className="w-full bg-[#181818] p-2 rounded text-white" />}
              <input type="email" placeholder="Email" value={isSignUp ? regEmail : loginEmail} onChange={e=>isSignUp ? setRegEmail(e.target.value) : setLoginEmail(e.target.value)} className="w-full bg-[#181818] p-2 rounded text-white" />
              <input type="password" placeholder="Password" value={isSignUp ? regPassword : loginPassword} onChange={e=>isSignUp ? setRegPassword(e.target.value) : setLoginPassword(e.target.value)} className="w-full bg-[#181818] p-2 rounded text-white" />
              <button type="submit" className="w-full bg-purple-600 p-2 rounded font-bold text-white">{isSignUp ? "Register" : "Login"}</button>
            </form>
            <button onClick={() => setIsSignUp(!isSignUp)} className="text-purple-400 block mx-auto mt-2 text-[10px]">
              {isSignUp ? "Have account? Login" : "New user? Sign up"}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));

