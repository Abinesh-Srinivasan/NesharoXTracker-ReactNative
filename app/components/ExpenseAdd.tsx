import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  Keyboard,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useState } from "react";

type Expense = {
  id: number;
  category: string;
  amount: number;
  date: string;
  description: string;
};

type ExpenseAddProps = {
  onAddExpense: (newExpense: Expense) => void;
};

const ExpenseAdd: React.FC<ExpenseAddProps> = ({ onAddExpense }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [newExpense, setNewExpense] = useState<Expense>({
    id: Date.now(),
    category: "",
    amount: 0,
    date: "",
    description: "",
  });

  useEffect(() => {
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

  const handleEditChange = (field: string, value: string) => {
    if (field === "amount") {
      const numericValue = value === "" ? 0 : parseFloat(value);
      setNewExpense((prev) => ({
        ...prev,
        amount: numericValue,
      }));
    } else {
      setNewExpense((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSubmit = () => {
    if (
      !newExpense.category ||
      !newExpense.amount ||
      !newExpense.date ||
      !newExpense.description
    ) {
      Alert.alert("Msg from Nesharo", "Please fill all the details");
      return;
    }

    if (isNaN(newExpense.amount)) {
      Alert.alert("Msg from Nesharo", "Please enter a valid amount");
      return;
    }

    // check if the date is in the future
    const [day, month, year] = newExpense.date.split("-").map(Number);
    const enteredDate = new Date(year, month - 1, day);
    const today = new Date();

    if (enteredDate > today) {
      Alert.alert("Msg from Nesharo", "Future date is not allowed");
      return;
    }

    // pass the newExpense to the parent component ExpensesTab.tsx
    onAddExpense(newExpense);

    setNewExpense({
      id: Date.now(),
      category: "",
      amount: 0,
      date: "",
      description: "",
    });

    setShowAddForm(false);
  };
  return (
    <View>
      {/* header */}
      <View className=" mx-6 flex flex-row  w-auto justify-between items-center">
        <Text className=" font-rubik-extrabold text-4xl text-indigo-500">
          Nesharo
        </Text>
        <TouchableOpacity onPress={() => setShowAddForm(true)}>
          <Ionicons name="add-circle" size={64} color="#007AFF" />
        </TouchableOpacity>
      </View>
      {/* form */}
      {showAddForm && (
        <View
          className={`${
            isKeyboardVisible ? "top-4" : "top-44"
          } absolute left-8 bg-white h-[35rem] w-10/12 px-10 py-10 shadow-inherit shadow-lg flex flex-col rounded-2xl z-20 gap-8 items-center`}
        >
          <Text className=" text-center font-rubik-bold text-3xl">
            Add Expense
          </Text>
          <View className=" flex flex-col gap-5 w-full">
            <TextInput
              value={newExpense.category}
              onChangeText={(text) => handleEditChange("category", text)}
              maxLength={12}
              placeholder="Category"
              className="font-rubik-regular border border-gray-300 rounded-md pl-3 py-3"
            />
            <TextInput
              value={newExpense.amount.toString()}
              onChangeText={(text) => handleEditChange("amount", text)}
              maxLength={10}
              keyboardType="numeric"
              placeholder="Amount"
              className="font-rubik-regular border border-gray-300 rounded-md pl-3 py-3"
            />
            <TextInput
              value={newExpense.date}
              onChangeText={(text) => handleEditChange("date", text)}
              maxLength={10}
              keyboardType="numeric"
              placeholder="DD-MM-YYYY"
              className="font-rubik-regular border border-gray-300 rounded-md pl-3 py-3"
            />
            <TextInput
              value={newExpense.description}
              onChangeText={(text) => handleEditChange("description", text)}
              maxLength={157}
              multiline
              placeholder="Description"
              className="font-rubik-regular border border-gray-300 rounded-md pl-3 h-32 py-3"
              style={{ textAlignVertical: "top" }}
            />
          </View>
          <View className=" flex flex-row gap-10">
            <TouchableOpacity
              className="border px-8 py-2  border-transparent bg-green-500 rounded-lg"
              onPress={handleSubmit}
            >
              <Text className=" text-center text-white tracking-wide text-lg font-rubik-medium">
                Submit
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="border px-8 py-2  border-transparent bg-red-500 rounded-lg"
              onPress={() => setShowAddForm(false)}
            >
              <Text className=" text-center text-white tracking-wide text-lg font-rubik-medium">
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};
export default ExpenseAdd;
