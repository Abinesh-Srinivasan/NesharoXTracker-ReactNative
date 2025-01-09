import ExpenseDisplay from "../components/ExpenseDisplay";
import ExpenseAdd from "../components/ExpenseAdd";
import { SafeAreaView } from "react-native-safe-area-context";

type Expense = {
  id: number;
  category: string;
  amount: number;
  date: string;
  description: string;
};

interface ExpenseTabProps {
  expenses: Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
}

const ExpensesTab = ({ expenses, setExpenses }: ExpenseTabProps) => {
  const addExpense = (newExpense: Expense) => {
    setExpenses((prevExpenses) => [...prevExpenses, newExpense]);
  };

  return (
    <SafeAreaView className=" h-full w-full bg-white pt-5 pb-14">
      <ExpenseAdd onAddExpense={addExpense} />
      <ExpenseDisplay expenses={expenses} setExpenses={setExpenses} />
    </SafeAreaView>
  );
};

export default ExpensesTab;
