import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProfileMenu from "../components/ProfileMenu";

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top Navbar */}
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">🤖RAGenius</h1>
        {/* <div className="flex gap-4">
          <button
            onClick={() => navigate("/login")}
            className="text-gray-600 font-medium hover:text-blue-600"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Register
          </button>
        </div> */}

        {/* Profile Menu */}
        {isAuthenticated ? (
          <ProfileMenu />
        ) : (
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/login")}
              className="text-gray-600 font-medium hover:text-blue-600"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Register
            </button>
          </div>
        )}
      </nav>

      {/* Main Hero */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Intelligent AI Chat with Memory & Context
          </h2>

          <p className="text-gray-600 mb-8 text-lg">
            A real-time AI chatbot powered by Retrieval-Augmented Generation
            (RAG), Vector Database memory, and Socket.IO for instant
            conversations.
          </p>

          <div className="flex justify-center gap-4 mb-12 lg:mb-0">
            <button
              onClick={() => navigate("/chat")}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              Start Chatting
            </button>

            <button
              onClick={() => navigate("/register")}
              className="border border-blue-600 text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition"
            >
              Create Account
            </button>
          </div>
        </div>
      </main>

      {/* Features */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              🧠 Long-Term Memory
            </h3>
            <p className="text-gray-600 text-sm">
              Conversations are stored in a vector database for semantic recall
              and personalized responses.
            </p>
          </div>

          <div className="p-6 rounded-2xl shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              📚 RAG-Powered Answers
            </h3>
            <p className="text-gray-600 text-sm">
              AI responses are grounded using retrieved context, reducing
              hallucinations and improving accuracy.
            </p>
          </div>

          <div className="p-6 rounded-2xl shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              ⚡ Real-Time Chat
            </h3>
            <p className="text-gray-600 text-sm">
              Socket.IO enables instant messaging with streaming-ready
              architecture.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 text-center py-4 text-sm text-gray-500">
        An AI that chats, remembers, and learns — built with ❤️ using MERN ⚛️🚀,
        RAG 🧠, Gemini ✨, real-time Socket.IO ⚡, MongoDB 🍃 & VectorDB 🔍
      </footer>
    </div>
  );
};

export default Home;
