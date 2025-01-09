import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  SectionList,
  Alert,
  Keyboard,
} from "react-native";

const editIcon = require("@/assets/images/ExpenseCardIcons/edit.png");
const deleteIcon = require("@/assets/images/ExpenseCardIcons/delete.png");

type Expense = {
  id: number;
  category: string;
  amount: number;
  date: string;
  description: string;
};
type ExpenseDisplayProps = {
  expenses: Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
};
const ExpenseDisplay: React.FC<ExpenseDisplayProps> = ({
  expenses,
  setExpenses,
}) => {
  const [todayExpenses, setTodayExpenses] = useState<Expense[]>([]);
  const [thisMonthExpenses, setThisMonthExpenses] = useState<Expense[]>([]);
  const [pastExpenses, setPastExpenses] = useState<Expense[]>([]);

  const [showPopup, setShowPopup] = useState(false);
  const [popupItem, setPopupItem] = useState<Expense | null>(null);

  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

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
      setTodayExpenses([...todayExpenses].reverse());
      setThisMonthExpenses([...thisMonthExpenses].reverse());
      setPastExpenses([...pastExpenses].reverse());
    });
  };

  useEffect(() => {
    categorizeExpenses();
  }, [expenses]);

  const sections = [
    { title: "Today", data: todayExpenses },
    { title: "This Month", data: thisMonthExpenses },
    { title: "Past Expenses", data: pastExpenses },
  ].filter((section) => section.data.length > 0);

  const renderSectionHeader = ({ section: { title } }: any) => (
    <Text className=" pl-2 font-rubik-semibold text-2xl text-violet-900 mb-2">
      {title}
    </Text>
  );

  const [editExpense, setEditExpense] = useState<{
    category: string;
    amount: number;
    date: string;
    id: number;
    description: string;
  } | null>(null);

  const handlePopupOpen = (item: Expense) => {
    setShowPopup(true);
    setPopupItem(item);
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    setPopupItem(null);
  };

  const handleEditOpen = (item: Expense) => {
    setEditExpense(item);
  };

  const handleEditChange = (field: string, value: string) => {
    if (field === "amount") {
      if (value === "") {
        setEditExpense((prev) => (prev ? { ...prev, [field]: 0 } : null));
      } else {
        const numericValue = parseFloat(value);
        if (isNaN(numericValue)) {
          return;
        }
        setEditExpense((prev) =>
          prev ? { ...prev, [field]: numericValue } : null
        );
      }
    } else {
      setEditExpense((prev) => (prev ? { ...prev, [field]: value } : null));
    }
  };

  const handleEditSave = (editExpense: Expense) => {
    if (isNaN(editExpense.amount) || editExpense.amount <= 0) {
      Alert.alert("Msg from Nesharo", "Please Enter a Valid Amount");
      return;
    }
    // check if the date is in the future
    const [day, month, year] = editExpense.date.split("-").map(Number);
    const enteredDate = new Date(year, month - 1, day);
    const today = new Date();
    if (enteredDate > today) {
      Alert.alert("Msg from Nesharo", "Future date is not allowed");
      return;
    }
    setExpenses((prev) =>
      prev.map((expense) =>
        expense.id === editExpense?.id ? editExpense : expense
      )
    );
    setEditExpense(null);
  };

  const handleEditCancel = () => {
    setEditExpense(null);
  };

  const handleDelete = (id: number) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id));
  };

  const renderExpenseCard = ({ item }: { item: Expense }) => {
    return (
      <View className=" flex flex-row px-6 pb-4 items-center justify-between">
        {/* Category,Amount,Date */}
        <View className=" flex flex-col">
          <Text className=" font-rubik-medium text-xl text-red-500">
            {item.category}
          </Text>
          <Text className=" text-blue-500 text-lg font-rubik-semibold">
            ₹{item.amount}
          </Text>
          <Text className=" tracking-wider font-rubik-semibold">
            {item.date}
          </Text>
        </View>
        {/* Buttons */}
        <View className=" flex flex-row items-center gap-3">
          <TouchableOpacity
            className="border border-white px-3 py-1 rounded-lg bg-green-500"
            onPress={() => handlePopupOpen(item)}
          >
            <Text className=" font-rubik-regular tracking-wide text-white">
              More
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="border border-white px-3 py-1 rounded-lg bg-orange-500"
            onPress={() => handleEditOpen(item)}
          >
            <Image source={editIcon} className=" size-6" />
          </TouchableOpacity>
          <TouchableOpacity
            className="border border-white px-3 py-1 rounded-lg bg-red-500"
            onPress={() => handleDelete(item.id)}
          >
            <Image source={deleteIcon} className=" size-6" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

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

  return (
    <View className=" px-6 mt-3">
      {expenses.length > 0 ? (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id.toString()}
          renderSectionHeader={renderSectionHeader}
          renderItem={renderExpenseCard}
          contentContainerStyle={{ paddingBottom: 20 }}
          stickySectionHeadersEnabled={false}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View className="h-full flex justify-center">
          <Text className="font-rubik-bold tracking-wider text-2xl leading-9 text-center text-blue-600">
            Add your First Expense {"\n"} by Clicking the{" "}
            <Text className="text-3xl text-indigo-500">+</Text> icon
          </Text>
        </View>
      )}
      {/* popup card */}
      {showPopup && (
        <View className=" absolute top-56 bottom-56 left-20 bg-white h-80 w-9/12 px-5 py-8 shadow-inherit shadow-lg flex flex-col justify-between rounded-2xl z-20">
          <View className=" flex flex-col gap-3">
            <Text className=" font-rubik-bold text-pink-600">
              {popupItem?.date}
            </Text>
            <View className=" flex  flex-row justify-between">
              <Text className=" font-rubik-semibold text-2xl text-violet-600">
                {popupItem?.category}
              </Text>
              <Text className=" font-rubik-semibold text-blue-600 text-lg">
                ₹{popupItem?.amount}
              </Text>
            </View>
            <Text className=" font-rubik-regular leading-6 tracking-wide text-gray-700">
              {popupItem?.description}
            </Text>
          </View>
          <TouchableOpacity onPress={handlePopupClose}>
            <Text className=" text-center font-rubik-semibold text-red-600 text-lg">
              Close
            </Text>
          </TouchableOpacity>
        </View>
      )}
      {/* edit form */}
      {editExpense && (
        <View
          className={`${
            isKeyboardVisible ? "top-0" : "top-28"
          } absolute w-11/12 left-10 bg-white h-[35rem] flex flex-col px-10 gap-10 py-8 shadow-black shadow-lg rounded-2xl z-20`}
        >
          <Text className=" text-center font-rubik-bold text-2xl tracking-wide">
            Edit Expense{" "}
          </Text>
          <View className=" flex flex-col gap-4">
            <TextInput
              placeholder="Category"
              value={editExpense.category}
              maxLength={12}
              onChangeText={(text) => handleEditChange("category", text)}
              className=" font-rubik-regular border border-gray-300 rounded-md pl-3 py-3"
            />
            <TextInput
              placeholder="Amount"
              value={editExpense.amount.toString()}
              maxLength={10}
              onChangeText={(text) => handleEditChange("amount", text)}
              keyboardType="numeric"
              className=" font-rubik-regular border border-gray-300 rounded-md pl-3 py-3"
            />
            <TextInput
              placeholder="DD-MM-YYYY"
              value={editExpense.date}
              keyboardType="numeric"
              maxLength={10}
              onChangeText={(text) => handleEditChange("date", text)}
              className=" font-rubik-regular border border-gray-300 rounded-md pl-3 py-3"
            />
            <TextInput
              placeholder="Description"
              value={editExpense.description}
              multiline
              maxLength={157}
              onChangeText={(text) => handleEditChange("description", text)}
              className=" font-rubik-regular border border-gray-300 rounded-md pl-3 h-32 py-3"
              style={{ textAlignVertical: "top" }}
            />
          </View>
          <View className=" flex flex-row justify-between px-3">
            <TouchableOpacity
              className=" border px-6 py-2  border-transparent bg-green-600 rounded-lg"
              onPress={() => handleEditSave(editExpense)}
            >
              <Text className=" font-rubik-medium text-white">Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className=" border px-6 py-2  border-transparent bg-red-500 rounded-lg"
              onPress={handleEditCancel}
            >
              <Text className=" font-rubik-medium text-white">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};
export default ExpenseDisplay;
