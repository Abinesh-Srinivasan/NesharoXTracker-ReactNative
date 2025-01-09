import { Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DashboardHeader from "../components/DashboardHeader";
import BudgetDashboard from "../components/BudgetDashboard";
import BarchartComponent from "../components/BarchartComponent";
import ProgressChartComponent from "../components/ProgressChartComponent";
import YearlyExpenses from "../components/YearlyExpenses";
import { useEffect, useState } from "react";

type Expense = {
  id: number;
  category: string;
  amount: number;
  date: string;
  description: string;
};

interface DashboardProps {
  todayExpenses: Expense[];
  thisMonthExpenses: Expense[];
  pastExpenses: Expense[];
}

const DashboardTab = ({
  todayExpenses,
  thisMonthExpenses,
  pastExpenses,
}: DashboardProps) => {
  const [dashboardContent, setDashboardContent] = useState("This Month");
  const [budgetLimitMonth, setBudgetLimitMonth] = useState(0);
  const [budgetLimitToday, setBudgetLimitToday] = useState(0);

  const [todayExpensesTotal, setTodayExpensesTotal] = useState(0);
  const [thisMonthExpensesTotal, setThisMonthExpensesTotal] = useState(0);
  const [pastExpensesTotal, setPastExpensesTotal] = useState(0);
  // hook for barchart component
  const [dailyExpenses, setDailyExpenses] = useState<number[]>([]);
  // hook for piechart component
  const [categoryExpenses, setCategoryExpenses] = useState<
    { name: string; amount: number; color: string }[]
  >([]);

  useEffect(() => {
    const todayExpensesTotal = todayExpenses.reduce(
      (total, expense) => total + expense.amount,
      0
    );
    const thisMonthExpensesTotal = thisMonthExpenses.reduce(
      (total, expense) => total + expense.amount,
      0
    );
    const pastExpensesTotal = pastExpenses.reduce(
      (total, expense) => total + expense.amount,
      0
    );

    setTodayExpensesTotal(todayExpensesTotal);
    setThisMonthExpensesTotal(thisMonthExpensesTotal + todayExpensesTotal);
    setPastExpensesTotal(pastExpensesTotal);
  }, [todayExpenses, thisMonthExpenses, pastExpenses]);

  // functions for Barchart component
  useEffect(() => {
    const dailyExpenses = Array.from({ length: 31 }, () => 0);

    const parseDate = (dateString: string) => {
      const [day, month, year] = dateString.split("-").map(Number);
      return new Date(year, month - 1, day); // Month is zero-based
    };

    thisMonthExpenses.forEach((expense) => {
      const date = parseDate(expense.date).getDate();
      dailyExpenses[date - 1] += expense.amount;
    });
    todayExpenses.forEach((expense) => {
      const date = parseDate(expense.date).getDate();
      dailyExpenses[date - 1] += expense.amount;
    });
    setDailyExpenses(dailyExpenses);
  }, [thisMonthExpenses]);

  // functions for PieChart component
  useEffect(() => {
    const categoryTotal: Record<string, number> = {};
    todayExpenses.forEach((expense) => {
      if (categoryTotal[expense.category]) {
        categoryTotal[expense.category] += expense.amount;
      } else {
        categoryTotal[expense.category] = expense.amount;
      }
    });
    const colors = [
      "#E53935", // Rich Red
      "#1E88E5", // Deep Blue
      "#FB8C00", // Burnt Orange
      "#43A047", // Forest Green
      "#8E24AA", // Vibrant Purple
      "#FFB300", // Amber
    ];

    const processedCategoryExpenses = Object.keys(categoryTotal).map(
      (category, index) => ({
        name: category,
        amount: categoryTotal[category],
        color: colors[index % colors.length],
      })
    );
    setCategoryExpenses(processedCategoryExpenses);
  }, [todayExpenses]);

  return (
    <SafeAreaView className=" h-full bg-white">
      <DashboardHeader
        dashboardContent={dashboardContent}
        setDashboardContent={setDashboardContent}
      />
      <ScrollView>
        <Text className=" ml-5 mt-10 font-rubik-bold text-3xl text-blue-600 tracking-wide ">
          Expenses Computation
        </Text>
        <BudgetDashboard
          dashboardContent={dashboardContent}
          budgetLimitMonth={budgetLimitMonth}
          setBudgetLimitMonth={setBudgetLimitMonth}
          budgetLimitToday={budgetLimitToday}
          setBudgetLimitToday={setBudgetLimitToday}
          todayExpensesTotal={todayExpensesTotal}
          thisMonthExpensesTotal={thisMonthExpensesTotal}
          pastExpensesTotal={pastExpensesTotal}
        />
        {dashboardContent === "This Month" && (
          <BarchartComponent data={dailyExpenses} />
        )}
        {dashboardContent === "Today" && (
          <ProgressChartComponent data={categoryExpenses} />
        )}
        {dashboardContent === "Past Expenses" && (
          <YearlyExpenses setDashboardContent={setDashboardContent} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
export default DashboardTab;
