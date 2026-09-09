import { OrderModalProvider } from './components/OrderModal.jsx';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import BrandStrip from './components/BrandStrip.jsx';
import Showcase from './components/Showcase.jsx';
import Feature from './components/Feature.jsx';
import Story from './components/Story.jsx';
import Namesake from './components/Namesake.jsx';
import Gallery from './components/Gallery.jsx';
import Reviews from './components/Reviews.jsx';
import Locations from './components/Locations.jsx';
import FinalCta from './components/FinalCta.jsx';
import Footer from './components/Footer.jsx';
import StickyOrderBar from './components/StickyOrderBar.jsx';

export default function App() {
  return (
    <OrderModalProvider>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <span id="top" />
      <Header />
      <main id="main">
        <Hero />
        <BrandStrip />
        <Showcase />
        <Feature />
        <Story />
        <Namesake />
        <Gallery />
        <Reviews />
        <Locations />
        <FinalCta />
      </main>
      <Footer />
      <StickyOrderBar />
    </OrderModalProvider>
  );
}
