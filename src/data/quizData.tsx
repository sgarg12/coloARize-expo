import { ImageSourcePropType } from "react-native";

export type quizQuestion = {
  image: ImageSourcePropType;
  options: string[];
  answer: string;
  type: "Deuteranopia" | "Protanopia" | "Tritanopia";
};

export const DeuteranopiaQuizAnswerKey: quizQuestion[] = [
  {
    image: require("../assets/Deuteranopia_test_images/D0.png"),
    options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Not Sure"],
    answer: "0",
    type: "Deuteranopia",
  },
  {
    image: require("../assets/Deuteranopia_test_images/D1_.png"),
    options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Not Sure"],
    answer: "1",
    type: "Deuteranopia",
  },
  {
    image: require("../assets/Deuteranopia_test_images/D1.png"),
    options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Not Sure"],
    answer: "1",
    type: "Deuteranopia",
  },
  {
    image: require("../assets/Deuteranopia_test_images/D2_.png"),
    options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Not Sure"],
    answer: "2",
    type: "Deuteranopia",
  },
  {
    image: require("../assets/Deuteranopia_test_images/D2.png"),
    options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Not Sure"],
    answer: "2",
    type: "Deuteranopia",
  },
  {
    image: require("../assets/Deuteranopia_test_images/D3.png"),
    options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Not Sure"],
    answer: "3",
    type: "Deuteranopia",
  },
  {
    image: require("../assets/Deuteranopia_test_images/D4___.png"),
    options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Not Sure"],
    answer: "4",
    type: "Deuteranopia",
  },
  {
    image: require("../assets/Deuteranopia_test_images/D4__.png"),
    options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Not Sure"],
    answer: "4",
    type: "Deuteranopia",
  },
  {
    image: require("../assets/Deuteranopia_test_images/D4_.png"),
    options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Not Sure"],
    answer: "4",
    type: "Deuteranopia",
  },
  {
    image: require("../assets/Deuteranopia_test_images/D4.png"),
    options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Not Sure"],
    answer: "4",
    type: "Deuteranopia",
  },
  {
    image: require("../assets/Deuteranopia_test_images/D5_.png"),
    options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Not Sure"],
    answer: "5",
    type: "Deuteranopia",
  },
  {
    image: require("../assets/Deuteranopia_test_images/D5.png"),
    options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Not Sure"],
    answer: "5",
    type: "Deuteranopia",
  },
  {
    image: require("../assets/Deuteranopia_test_images/D6.png"),
    options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Not Sure"],
    answer: "6",
    type: "Deuteranopia",
  },
  {
    image: require("../assets/Deuteranopia_test_images/D7_.png"),
    options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Not Sure"],
    answer: "7",
    type: "Deuteranopia",
  },
  {
    image: require("../assets/Deuteranopia_test_images/D7.png"),
    options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Not Sure"],
    answer: "7",
    type: "Deuteranopia",
  },
  {
    image: require("../assets/Deuteranopia_test_images/D8.png"),
    options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Not Sure"],
    answer: "8",
    type: "Deuteranopia",
  },
  {
    image: require("../assets/Deuteranopia_test_images/D9_.png"),
    options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Not Sure"],
    answer: "9",
    type: "Deuteranopia",
  },
  {
    image: require("../assets/Deuteranopia_test_images/D9.png"),
    options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Not Sure"],
    answer: "9",
    type: "Deuteranopia",
  },
];

export const ProtanopiaQuizAnswerKey: quizQuestion[] = [
  {
    image: require("../assets/Protanopia_test_images/P0_.png"),
    options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Not Sure"],
    answer: "0",
    type: "Protanopia",
  },
  {
    image: require("../assets/Protanopia_test_images/P0.png"),
    options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Not Sure"],
    answer: "0",
    type: "Protanopia",
  },
  {
    image: require("../assets/Protanopia_test_images/P1.png"),
    options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Not Sure"],
    answer: "1",
    type: "Protanopia",
  },
  {
    image: require("../assets/Protanopia_test_images/P2_.png"),
    options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Not Sure"],
    answer: "2",
    type: "Protanopia",
  },
  {
    image: require("../assets/Protanopia_test_images/P2.png"),
    options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Not Sure"],
    answer: "2",
    type: "Protanopia",
  },
  {
    image: require("../assets/Protanopia_test_images/P3__.png"),
    options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Not Sure"],
    answer: "3",
    type: "Protanopia",
  },
  {
    image: require("../assets/Protanopia_test_images/P3_.png"),
    options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Not Sure"],
    answer: "3",
    type: "Protanopia",
  },
  {
    image: require("../assets/Protanopia_test_images/P3.png"),
    options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Not Sure"],
    answer: "3",
    type: "Protanopia",
  },
  {
    image: require("../assets/Protanopia_test_images/P4___.png"),
    options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Not Sure"],
    answer: "4",
    type: "Protanopia",
  },
  {
    image: require("../assets/Protanopia_test_images/P4__.png"),
    options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Not Sure"],
    answer: "4",
    type: "Protanopia",
  },
  {
    image: require("../assets/Protanopia_test_images/P4_.png"),
    options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Not Sure"],
    answer: "4",
    type: "Protanopia",
  },
  {
    image: require("../assets/Protanopia_test_images/P4.png"),
    options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Not Sure"],
    answer: "4",
    type: "Protanopia",
  },
  {
    image: require("../assets/Protanopia_test_images/P5.png"),
    options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Not Sure"],
    answer: "5",
    type: "Protanopia",
  },
  {
    image: require("../assets/Protanopia_test_images/P6.png"),
    options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Not Sure"],
    answer: "6",
    type: "Protanopia",
  },
  {
    image: require("../assets/Protanopia_test_images/P7.png"),
    options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Not Sure"],
    answer: "7",
    type: "Protanopia",
  },
  {
    image: require("../assets/Protanopia_test_images/P9_.png"),
    options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Not Sure"],
    answer: "9",
    type: "Protanopia",
  },
  {
    image: require("../assets/Protanopia_test_images/P9.png"),
    options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Not Sure"],
    answer: "9",
    type: "Protanopia",
  },
];

export const TritanopiaQuizAnswerKey: quizQuestion[] = [
  {
    image: require("../assets/Tritanopia_test_images/T0__.png"),
    options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Not Sure"],
    answer: "0",
    type: "Tritanopia",
  },
  {
    image: require("../assets/Tritanopia_test_images/T0_.png"),
    options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Not Sure"],
    answer: "0",
    type: "Tritanopia",
  },
  {
    image: require("../assets/Tritanopia_test_images/T0.png"),
    options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Not Sure"],
    answer: "0",
    type: "Tritanopia",
  },
  {
    image: require("../assets/Tritanopia_test_images/T1.png"),
    options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Not Sure"],
    answer: "1",
    type: "Tritanopia",
  },
  {
    image: require("../assets/Tritanopia_test_images/T2.png"),
    options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Not Sure"],
    answer: "2",
    type: "Tritanopia",
  },
  {
    image: require("../assets/Tritanopia_test_images/T3.png"),
    options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Not Sure"],
    answer: "3",
    type: "Tritanopia",
  },
  {
    image: require("../assets/Tritanopia_test_images/T4__.png"),
    options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Not Sure"],
    answer: "4",
    type: "Tritanopia",
  },
  {
    image: require("../assets/Tritanopia_test_images/T4_.png"),
    options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Not Sure"],
    answer: "4",
    type: "Tritanopia",
  },
  {
    image: require("../assets/Tritanopia_test_images/T4.png"),
    options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Not Sure"],
    answer: "4",
    type: "Tritanopia",
  },
  {
    image: require("../assets/Tritanopia_test_images/T5.png"),
    options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Not Sure"],
    answer: "5",
    type: "Tritanopia",
  },
  {
    image: require("../assets/Tritanopia_test_images/T6___.png"),
    options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Not Sure"],
    answer: "6",
    type: "Tritanopia",
  },
  {
    image: require("../assets/Tritanopia_test_images/T6__.png"),
    options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Not Sure"],
    answer: "6",
    type: "Tritanopia",
  },
  {
    image: require("../assets/Tritanopia_test_images/T6_.png"),
    options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Not Sure"],
    answer: "6",
    type: "Tritanopia",
  },
  {
    image: require("../assets/Tritanopia_test_images/T6.png"),
    options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Not Sure"],
    answer: "6",
    type: "Tritanopia",
  },
  {
    image: require("../assets/Tritanopia_test_images/T7.png"),
    options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Not Sure"],
    answer: "7",
    type: "Tritanopia",
  },
  {
    image: require("../assets/Tritanopia_test_images/T8_.png"),
    options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Not Sure"],
    answer: "8",
    type: "Tritanopia",
  },
  {
    image: require("../assets/Tritanopia_test_images/T8.png"),
    options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Not Sure"],
    answer: "8",
    type: "Tritanopia",
  },
  {
    image: require("../assets/Tritanopia_test_images/T9___.png"),
    options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Not Sure"],
    answer: "9",
    type: "Tritanopia",
  },
  {
    image: require("../assets/Tritanopia_test_images/T9__.png"),
    options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Not Sure"],
    answer: "9",
    type: "Tritanopia",
  },
  {
    image: require("../assets/Tritanopia_test_images/T9_.png"),
    options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Not Sure"],
    answer: "9",
    type: "Tritanopia",
  },
  {
    image: require("../assets/Tritanopia_test_images/T9.png"),
    options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Not Sure"],
    answer: "9",
    type: "Tritanopia",
  },
];
