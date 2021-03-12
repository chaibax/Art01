import i18n from "i18next";
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from "react-i18next";
var userLang = navigator.language || navigator.userLanguage; 
console.log("🇫🇷 The language is: " + userLang);// the translations
// (tip move them in a JSON file and import them)
const resources = {
  en: {
    translation: {
      "first massively participatory art project": "first massively participatory art project",
      "participate": "participate",
      "welcome back painter #" : "welcome back painter #",
      "View paiting" : "View paiting",
      "LET'S CREATE TOGETHER A PAINTING THAT NEEDS A BILLION PARTICIPANTS TO BE FINISHED" : "LET'S CREATE TOGETHER A PAINTING THAT NEEDS A BILLION PARTICIPANTS TO BE FINISHED",
      "This painting size will be 40,000 pixel wide by 25,000 pixel high (that is 1 000 000 000 pixels). Every pixel (colored dot) is added by one person, you for example. When you first signs in, a colored dot corresponding to your Internet address is added" : "This painting size will be 40,000 pixel wide by 25,000 pixel high (that is 1 000 000 000 pixels). Every pixel (colored dot) is added by one person, you for example. When you first signs in, a colored dot corresponding to your Internet address is added",
      "It's your pixel, your contribution" : "It's your pixel, your contribution",
      "NEXT" : "NEXT",
      "For the moment" : "For the moment",
      "people have participated to this project since its beginning" : "people have participated to this project since its beginning",
      "of the painting is complete" : "of the painting is complete",
      "At this rate, 1000000000.art be finished in" : "At this rate, 1000000000.art be finished in",
      "years" : "years",
      "Participate" : "Participate",
      "Because there cannot be several particiaption per person, your email/signup will be requested in the next step." : "              Because there cannot be several particiaption per person, your email/signup will be requested in the next step.",
      "This is a free, non-commercial, open source, participatory art project. I have nothing to sell." : "This is a free, non-commercial, open source, participatory art project. I have nothing to sell."
    }
  },
  fr: {
    translation: {
      "first massively participatory art project": "première oeuvre d'art massivement participative",
      "participate" : "participer",
      "welcome back painter #" : "content de vous revoir peintre #",
      "View paiting" : "Voir la peinture",
      "LET'S CREATE TOGETHER A PAINTING THAT NEEDS A BILLION PARTICIPANTS TO BE FINISHED" : "CRÉONS ENSEMBLE UN TABLEAU QUI A BESOIN D'UN MILLIARD DE PARTICIPANTS POUR ÊTRE ACHEVÉ",
      "This painting size will be 40,000 pixel wide by 25,000 pixel high (that is 1 000 000 000 pixels). Every pixel (colored dot) is added by one person, you for example. When you first signs in, a colored dot corresponding to your Internet address is added" : "Ce tableau fera 40 000 pixels de large sur 25 000 de haut (soit 1 000 000 000 pixels). Chaque pixel (point de couleur) est ajouté par une personne, vous par  exemple. Quand vous vous inscrirez, un point de couleur correspondant à votre adresse internet sera ajouté.",
      "It's your pixel, your contribution" : "Cela sera votre pixel, votre contriubtion à l'oeuvre.",
      "NEXT" : "SUIVANT",
      "For the moment" : "Pour le moment",
      "people have participated to this project since its beginning" : "personnes ont participé à ce projet depuis son commencement",
      "of the painting is complete" : "du tableau est complété",
      "At this rate, 1000000000.art be finished in" : "Á ce rythme, 1000000000.art sera fini dans" ,
      "years" : "années" ,
      "Participate" : "Participer",
      "Because there cannot be several particiaption per person, your email/signup will be requested in the next step." : "Il ne peut y avoir qu'une participation par personne, c'est pourquoi votre email vous sera demandé à la prochaine étape",
      "This is a free, non-commercial, open source, participatory art project. I have nothing to sell." : "Ce projet artistique est un travail personnel, gratuit et open source. Je n'ai rien à vous vendre."  
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    fallbackLng: 'en',  
    resources,
    debug: true,

    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });
  export default i18n;