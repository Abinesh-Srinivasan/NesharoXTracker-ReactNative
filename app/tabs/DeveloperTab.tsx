import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Animatable from "react-native-animatable";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import { useEffect, useState } from "react";

const Abinesh = require("@/assets/images/abinesh.jpeg");
const Website = require("@/assets/images/SocialMediaIcons/website.png");
const LinkedIn = require("@/assets/images/SocialMediaIcons/linkedin.png");
const GitHub = require("@/assets/images/SocialMediaIcons/github.png");
const Instagram = require("@/assets/images/SocialMediaIcons/instagram.png");
const FaceBook = require("@/assets/images/SocialMediaIcons/facebook.png");
const LeetCode = require("@/assets/images/SocialMediaIcons/leetcode.png");
const GFG = require("@/assets/images/SocialMediaIcons/gfg.png");

const qualities = [
  "Full-Stack Website Developer",
  "Cross-Platform App Developer",
  "Machine Learning Engineer",
  "CS Undergraduate Student",
  "100+ LeetCode Challenge Solver",
  "MERN Stack Developer",
  "CyberSecurity Enthusiast",
  "Top 3 Institute Rank @ GFG",
  "Avid Bibliophile",
  "Finance Buff",
];

type Expense = {
  id: number;
  category: string;
  amount: number;
  date: string;
  description: string;
};

interface DeveloperTabProps {
  expenses: Expense[];
  setExpenses: (value: Expense[]) => void;
}

const DeveloperTab = ({ expenses, setExpenses }: DeveloperTabProps) => {
  const [currentQuality, setCurrentQuality] = useState(0);

  // used for text animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuality((prev) => (prev + 1) % qualities.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleExportAllExpenses = async () => {
    if (expenses.length === 0) {
      Alert.alert("Msg from Nesharo", "No Expenses to Export");
      return;
    }
    const csvHeader = "Nesharo Expenses Report\n\n";
    const csvColumn = "Category,Amount,Date,Description\n";
    const csvRows = expenses.map(
      (expense) =>
        `${expense.category},${expense.amount},${expense.date},${expense.description}`
    );
    const csvContent = csvHeader + csvColumn + csvRows.join("\n");

    try {
      // Save the CSV file in the app's private storage
      const fileName = "Expenses.csv";
      const fileUri = FileSystem.documentDirectory + fileName;

      await FileSystem.writeAsStringAsync(fileUri, csvContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      // Share the file using the sharing apps on device
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: "text/csv",
          dialogTitle: "Export Expenses",
        });
        // deleting temporary file after export
        await FileSystem.deleteAsync(fileUri);
      } else {
        Alert.alert("Error", "Sorry, Sharing is not available on your device.");
      }
    } catch (error) {
      console.error("Error exporting expenses:", error);
      Alert.alert("Error", "An error occurred while exporting expenses.");
    }
  };

  const handleClearAllExpenses = () => {
    if (expenses.length === 0) {
      Alert.alert("Msg from Nesharo", "No Expenses to Clear");
      return;
    }
    Alert.alert(
      "Confirmation",
      "Do you want to delete all expenses? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setExpenses([]);
            Alert.alert(
              "Msg from Nesharo",
              "All Expenses cleared successfully"
            );
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <SafeAreaView className=" h-full bg-white">
      <ScrollView>
        <View className="flex flex-col items-center mt-5 gap-3">
          <Image source={Abinesh} className=" size-64 rounded-full" />
          <View>
            <Text className=" font-rubik-bold text-3xl text-center">
              Abinesh @ Nesharo
            </Text>
            <Animatable.Text
              animation="shake"
              duration={500}
              className=" text-center font-rubik-regular text-xl text-slate-600"
              key={currentQuality}
            >
              {qualities[currentQuality]}
            </Animatable.Text>
            <TouchableOpacity
              onPress={() => Linking.openURL("https://nesharo.netlify.app")}
              className=" flex flex-row items-center justify-center gap-1"
            >
              <Image source={Website} className=" size-6" />
              <Text className=" font-rubik-medium text-xl">
                Visit Nesharo's Website
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* quote */}
        <View className=" mx-10 mt-3 bg-sky-400 px-7 py-5 rounded-2xl gap-2">
          <View className=" items-center">
            <Text className="font-rubik-regular text-white tracking-wider text-center text-lg">
              If you don't find a way to make money while you sleep, you will
              work until you die.
            </Text>
          </View>
          <View className=" items-end">
            <Text className="font-rubik-regular text-white tracking-wider text-lg">
              - Warren Buffett
            </Text>
          </View>
        </View>
        {/* social media */}
        <View className=" mt-6">
          <Text className=" text-center font-rubik-bold text-2xl">
            Catch Nesharo on
          </Text>
          {/* Icon Links */}
          <View className=" flex flex-col w-4/6 mx-20 mt-3 gap-2 ">
            <View className=" flex flex-row justify-between ">
              <TouchableOpacity
                className=" flex flex-row gap-1 items-center"
                onPress={() =>
                  Linking.openURL(
                    "https://www.linkedin.com/in/abineshsrinivasan/"
                  )
                }
              >
                <Image source={LinkedIn} className=" size-7" />
                <Text className=" font-rubik-medium tracking-wide text-lg text-[#0A66C2]">
                  LinkedIn
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className=" flex flex-row gap-1 items-center"
                onPress={() =>
                  Linking.openURL("https://github.com/Abinesh-Srinivasan")
                }
              >
                <Image source={GitHub} className=" size-7" />
                <Text className=" font-rubik-medium tracking-wide text-lg text-[#000000]">
                  GitHub
                </Text>
              </TouchableOpacity>
            </View>
            <View className=" flex flex-row justify-between ">
              <TouchableOpacity
                className=" flex flex-row gap-1 items-center"
                onPress={() =>
                  Linking.openURL("https://www.instagram.com/itsnesharodq/")
                }
              >
                <Image source={Instagram} className=" size-7" />
                <Text className=" font-rubik-medium tracking-wide text-lg text-[#E1306C]">
                  Instagram
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className=" flex flex-row gap-0 items-center"
                onPress={() =>
                  Linking.openURL(
                    "https://www.facebook.com/profile.php?id=61553094886881"
                  )
                }
              >
                <Image source={FaceBook} className=" size-7" />
                <Text className=" font-rubik-medium tracking-wide text-lg text-[#0165E1]">
                  FaceBook
                </Text>
              </TouchableOpacity>
            </View>
            <View className=" flex flex-row justify-between ">
              <TouchableOpacity
                className=" flex flex-row gap-1 items-center"
                onPress={() =>
                  Linking.openURL("https://leetcode.com/u/abin58113/")
                }
              >
                <Image source={LeetCode} className=" size-7" />
                <Text className=" font-rubik-medium tracking-wide text-lg text-amber-500">
                  LeetCode
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className=" flex flex-row gap-1 items-center"
                onPress={() =>
                  Linking.openURL(
                    "https://www.geeksforgeeks.org/user/abinesh_srinivasan/"
                  )
                }
              >
                <Image source={GFG} className=" size-7" />
                <Text className=" font-rubik-medium tracking-wide text-lg text-green-700">
                  GFG
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {/* delete and export data */}
        <View className=" mt-8 flex flex-col gap-3 items-center">
          <TouchableOpacity
            className=" border border-transparent bg-green-500 rounded-lg w-4/6 py-2"
            onPress={handleExportAllExpenses}
          >
            <Text className=" font-rubik-semibold text-2xl tracking-wide text-center text-white">
              Export All Expenses
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className=" border border-transparent bg-red-500 rounded-lg w-4/6 py-2"
            onPress={handleClearAllExpenses}
          >
            <Text className=" font-rubik-semibold text-2xl tracking-wide text-center text-white">
              Clear All Expenses
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default DeveloperTab;
