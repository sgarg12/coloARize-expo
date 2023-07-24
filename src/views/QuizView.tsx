/* eslint-disable react-native/no-inline-styles */
import React, { useState } from "react";

import {
  Image,
  Text,
  SafeAreaView,
  View,
  TouchableOpacity,
  Modal,
} from "react-native";
import {
  DeuteranopiaQuizAnswerKey,
  ProtanopiaQuizAnswerKey,
  TritanopiaQuizAnswerKey,
  quizQuestion,
} from "../data/quizData";

const QuizView = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [incorrectDeuteranopiaQuestions, setIncorrectDeuteranopiaQuestions] =
    useState(0);
  const [incorrectProtanopiaQuestions, setIncorrectProtanopiaQuestions] =
    useState(0);
  const [incorrectTritanopiaQuestions, setIncorrectTritanopiaQuestions] =
    useState(0);
  const [showDiagnosticModal, setShowDiagnosticModal] = useState(false);

  const deuteranopiaQuestions = DeuteranopiaQuizAnswerKey;
  const protanopiaQuestions = ProtanopiaQuizAnswerKey;
  const tritanopiaQuestions = TritanopiaQuizAnswerKey;

  const getQuestions = () => {
    var questions = [];

    for (let i = 0; i < 10; i++) {
      questions[i] = deuteranopiaQuestions[i];
      questions[i + 10] = protanopiaQuestions[i];
      questions[i + 20] = tritanopiaQuestions[i];
    }

    return questions;
  };

  var questions: quizQuestion[] = getQuestions();

  const handleNext = () => {
    if (currentQuestionIndex === questions.length - 1) {
      setShowDiagnosticModal(true);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const validateOption = (selectedOption: string) => {
    let rightAnswer = questions[currentQuestionIndex];

    if (selectedOption !== rightAnswer.answer) {
      switch (rightAnswer.type) {
        case "Deuteranopia":
          setIncorrectDeuteranopiaQuestions(incorrectDeuteranopiaQuestions + 1);
          break;
        case "Protanopia":
          setIncorrectProtanopiaQuestions(incorrectProtanopiaQuestions + 1);
          break;
        case "Tritanopia":
          setIncorrectTritanopiaQuestions(incorrectTritanopiaQuestions + 1);
          break;
        default:
          break;
      }
    }
    handleNext();
  };

  const renderQuestion = () => {
    return (
      <View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            padding: 10,
          }}
        >
          <Text style={{ fontSize: 20 }}>{currentQuestionIndex + 1}</Text>
          <Text style={{ fontSize: 20 }}>/{questions.length}</Text>
        </View>

        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text style={{ fontSize: 30 }}>What number do you see?</Text>
          <Image source={questions[currentQuestionIndex].image} />
        </View>
      </View>
    );
  };

  const renderOptions = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {questions[currentQuestionIndex].options.map((option) => (
          <TouchableOpacity
            key={option}
            style={{
              justifyContent: "center",
              alignItems: "center",
              width: option === "Not Sure" ? 150 : 50,
              borderWidth: 3,
              borderColor: "#FFFFFF",
              backgroundColor: "#724DC6",
              height: 50,
              borderRadius: 20,
              margin: 10,
            }}
            onPress={() => validateOption(option)}
          >
            <Text style={{ fontSize: 30, color: "#FFFFFF" }}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={showDiagnosticModal}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "#FFFFFF",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              width: "90%",
              borderRadius: 20,
              padding: 20,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 30, fontWeight: "bold" }}>
              {dichromacyDiagnosis()}
            </Text>

            <TouchableOpacity
              onPress={restartQuiz}
              style={{
                padding: 20,
                width: "100%",
                borderRadius: 20,
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 20,
                }}
              >
                Retry Quiz
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  const dichromacyDiagnosis = () => {
    if (
      incorrectDeuteranopiaQuestions > incorrectProtanopiaQuestions &&
      incorrectDeuteranopiaQuestions > incorrectTritanopiaQuestions
    ) {
      return "Deuteranopia";
    } else if (
      incorrectProtanopiaQuestions > incorrectDeuteranopiaQuestions &&
      incorrectProtanopiaQuestions > incorrectTritanopiaQuestions
    ) {
      return "Protanopia";
    } else if (
      incorrectTritanopiaQuestions > incorrectDeuteranopiaQuestions &&
      incorrectTritanopiaQuestions > incorrectProtanopiaQuestions
    ) {
      return "Tritanopia";
    } else {
      return "Multiple Deficiencies Detected";
    }
  };

  const restartQuiz = () => {
    setShowDiagnosticModal(false);
    setCurrentQuestionIndex(0);
  };

  return (
    <SafeAreaView>
      <View>
        {renderQuestion()}
        {renderOptions()}
        {renderModal()}
      </View>
    </SafeAreaView>
  );
};

export default QuizView;
