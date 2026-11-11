import adidas from "../assets/logos/adidas.svg";
import betc from "../assets/logos/betc.svg";
import buzzman from "../assets/logos/buzzman.png";
import canalPlus from "../assets/logos/canal-plus.svg";
import eurosport from "../assets/logos/eurosport.svg";
import franceTelevisions from "../assets/logos/france-televisions.svg";
import iconoclast from "../assets/logos/iconoclast.svg";
import laBanquePostale from "../assets/logos/la-banque-postale.svg";
import leCoqSportif from "../assets/logos/le-coq-sportif.svg";
import lego from "../assets/logos/lego.svg";
import lidl from "../assets/logos/lidl.svg";
import microsoft from "../assets/logos/microsoft.svg";
import norma from "../assets/logos/norma.webp";
import publicis from "../assets/logos/publicis.svg";
import quad from "../assets/logos/quad.svg";
import societeGenerale from "../assets/logos/societe-generale.svg";
import sonyPictures from "../assets/logos/sony-pictures.svg";
import tf1 from "../assets/logos/tf1.svg";
import volvic from "../assets/logos/volvic.png";
import whenWeWereKids from "../assets/logos/when-we-were-kids.png";

export type Client = {
  name: string; // proper noun, never translated
  logo: string | null; // image import, null = not provided yet (T23)
};

// Taken from Yoan's work history: broadcasters, production companies,
// advertising agencies and brands, mixed across two rows. A row must be wider
// than the carousel, otherwise the loop shows a gap: 10 tiles of 176 px cover
// the 1690 px of a 1920 px screen once the 6% side margins are removed.
export const clientRows: Client[][] = [
  [
    { name: "Canal+", logo: canalPlus },
    { name: "Adidas", logo: adidas },
    { name: "Publicis", logo: publicis },
    { name: "TF1", logo: tf1 },
    { name: "Microsoft", logo: microsoft },
    { name: "Iconoclast", logo: iconoclast },
    { name: "Lego", logo: lego },
    { name: "Norma", logo: norma },
    { name: "France Télévisions", logo: franceTelevisions },
    { name: "BETC", logo: betc },
  ],
  [
    { name: "Eurosport", logo: eurosport },
    { name: "Buzzman", logo: buzzman },
    { name: "Lidl", logo: lidl },
    { name: "Sony Pictures", logo: sonyPictures },
    { name: "Quad", logo: quad },
    { name: "Le Coq Sportif", logo: leCoqSportif },
    { name: "La Banque Postale", logo: laBanquePostale },
    { name: "When We Were Kids", logo: whenWeWereKids },
    { name: "Volvic", logo: volvic },
    { name: "Société Générale", logo: societeGenerale },
  ],
];
