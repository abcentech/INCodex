import Hero from "@/components/Hero";
import FreedomCalculator from "@/components/FreedomCalculator";
import { CoffeeComparison, CommunityStreaks } from "@/components/BehavioralComponents";
import BuffettRecord from "@/components/BuffettRecord";
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
      <FreedomCalculator />
      <CoffeeComparison />
      <View />
      <CommunityStreaks />
      <Term />
      <Pot />
      <Deposit />
      <FAQList />
      <BuffettRecord />
      <NewsletterForm />
      <Build />
    </main>
  );
}
