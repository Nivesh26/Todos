import { Navbar } from "../Components/Navbar";
import Hero from "../Components/Hero";

const Home = () => {
  return (
    <main className="relative min-h-screen w-full overflow-x-hidden">
      <Navbar />
      <Hero />
    </main>
  );
};

export default Home;