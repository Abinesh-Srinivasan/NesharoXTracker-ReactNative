import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Alert, Image, Keyboard } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import DashboardTab from "./tabs/DashboardTab";
import ExpensesTab from "./tabs/ExpensesTab";
import DeveloperTab from "./tabs/DeveloperTab";
import { useEffect, useState } from "react";

const DashboardIcon = require("@/assets/images/TabIcons/dashboard.png");
const ExpensesIcon = require("@/assets/images/TabIcons/expenses.png");
const DeveloperIcon = require("@/assets/images/TabIcons/user.png");

const Tab = createBottomTabNavigator();

export default function Index() {
  type Expense = {
    id: number;
    category: string;
    amount: number;
    date: string;
    description: string;
  };

  const [expenses, setExpenses] = useState<Expense[]>([]);

  const [todayExpenses, setTodayExpenses] = useState<Expense[]>([]);
  const [thisMonthExpenses, setThisMonthExpenses] = useState<Expense[]>([]);
  const [pastExpenses, setPastExpenses] = useState<Expense[]>([]);

  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const saveExpensesToStorage = async (expenses: Expense[]) => {
    try {
      await AsyncStorage.setItem("expenses", JSON.stringify(expenses));
    } catch (error) {
      console.log("Error in Saving Expenses:", error);
      Alert.alert("Error", "Error occured in Saving the Expenses to Storage");
    }
  };

  const loadExpensesFromStorage = async () => {
    try {
      const storedExpenses = await AsyncStorage.getItem("expenses");
      if (storedExpenses) {
        setExpenses(JSON.parse(storedExpenses));
      }
    } catch (error) {
      console.log("Error in loading expenses:", error);
      Alert.alert("Error", "Failed to load the expenses from storage");
    }
  };

  useEffect(() => {
    loadExpensesFromStorage();

    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setIsKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const categorizeExpenses = () => {
    const today = new Date();
    const todayExpenses: Expense[] = [];
    const thisMonthExpenses: Expense[] = [];
    const pastExpenses: Expense[] = [];

    const parseDate = (dateString: string) => {
      const [day, month, year] = dateString.split("-").map(Number);
      return new Date(year, month - 1, day);
    };

    expenses.forEach((expense) => {
      const expenseDate = parseDate(expense.date);
      if (
        expenseDate.getDate() === today.getDate() &&
        expenseDate.getMonth() === today.getMonth() &&
        expenseDate.getFullYear() === today.getFullYear()
      ) {
        todayExpenses.push(expense);
      } else if (
        expenseDate.getMonth() == today.getMonth() &&
        expenseDate.getFullYear() === today.getFullYear()
      ) {
        thisMonthExpenses.push(expense);
      } else {
        pastExpenses.push(expense);
      }
    }); // these brackets play a crucial role in the code's functionality, they caused me a huge headache while I was coding 😂
    setTodayExpenses([...todayExpenses].reverse());
    setThisMonthExpenses([...thisMonthExpenses].reverse());
    setPastExpenses([...pastExpenses].reverse());
    // "})" don't forget these line Nesharo
  };

  useEffect(() => {
    saveExpensesToStorage(expenses);
    categorizeExpenses();
  }, [expenses]);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: "blue",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: isKeyboardVisible
          ? { display: "none" }
          : {
              display: "flex",
              height: 70,
              paddingBottom: 20,
              paddingTop: 5,
              backgroundColor: "#f8f9fa",
            },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: "rubik-medium",
        },
        headerShown: false,
        tabBarIcon: ({ focused }) => {
          let iconSource;

          if (route.name === "Dashboard") {
            iconSource = DashboardIcon;
          } else if (route.name === "Expenses") {
            iconSource = ExpensesIcon;
          } else if (route.name === "Developer") {
            iconSource = DeveloperIcon;
          }

          return (
            <Image
              source={iconSource}
              style={{
                width: 20,
                height: 20,
                tintColor: focused ? "blue" : "gray",
              }}
              resizeMode="contain"
            />
          );
        },
      })}
    >
      <Tab.Screen name="Expenses">
        {() => <ExpensesTab expenses={expenses} setExpenses={setExpenses} />}
      </Tab.Screen>
      <Tab.Screen name="Dashboard">
        {() => (
          <DashboardTab
            todayExpenses={todayExpenses}
            thisMonthExpenses={thisMonthExpenses}
            pastExpenses={pastExpenses}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Developer">
        {() => <DeveloperTab expenses={expenses} setExpenses={setExpenses} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
