import { Analytics } from "@vercel/analytics/react";
import { usePath } from "@/lib/router";
import InitialLoader from "@/components/site/InitialLoader";
import { Footer, Header } from "@/components/site/Chrome";
import BackToTop from "@/components/site/BackToTop";
import ScrollHint from "@/components/site/ScrollHint";
import { About, Collections, Contact, Home, ProjectDetail, Services, Work } from "@/pages/pages";

export default function App() {
  const path = usePath();
  const [, root, slug] = path.split("/");

  let page;
  switch (root) {
    case "work":
      page = slug ? <ProjectDetail slug={slug} /> : <Work />;
      break;
    case "collections":
      page = <Collections />;
      break;
    case "services":
      page = <Services />;
      break;
    case "about":
      page = <About />;
      break;
    case "contact":
      page = <Contact />;
      break;
    default:
      page = <Home />;
  }

  return (
    <>
      <InitialLoader />
      <Header path={path} />
      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        <div key={path} className="page-enter">
          {page}
        </div>
      </main>
      <Footer />
      <ScrollHint />
      <BackToTop raised={path === "/"} />
      <Analytics />
    </>
  );
}
