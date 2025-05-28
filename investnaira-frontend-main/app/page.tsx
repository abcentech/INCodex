import Hero from "@/components/Hero";
import Pot from "@/components/Pot";
import View from "@/components/View";
import Deposit from "@/components/Deposit";
import FAQList from "../components/Faq";
import Build from "../components/Build";
import NewsletterForm from "@/components/Update";
import Term from "../components/Term";

export default function Home() {
  return (
    <main>
      <Hero />
      <View />
      <Term />
      <Pot />
      <Deposit />
      <FAQList />
      <NewsletterForm />
      <Build />
    </main>
  );
}
