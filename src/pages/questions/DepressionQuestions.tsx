import { Button } from "@/components/ui/button";

import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card";
import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from "@/components/ui/table";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { getData, postData, putData, deleteData } from "../../global/server";
import { logout } from "@/redux/authSlice";
import SideNavbar from "@/components/SideNavbar";
import CustomModal from "@/components/CustomModal";
import { Input } from "@/components/ui/input";

export default function DepressionQuestions() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(
    null
  );
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState<string[]>([""]);
  const [isMultipleChoice, setIsMultipleChoice] = useState(false);
  const user: any = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();

  console.log(isMultipleChoice);

  if (!user?.isAdmin || !user) {
    return <Navigate to="/" />;
  }

  const getQuestions = async () => {
    try {
      const response = await getData("/api/depressionQuestions", auth.token);
      setQuestions(response);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getQuestions();
  }, [location]);

  const openModalForNewQuestion = () => {
    setCurrentQuestionId(null);
    setQuestionText("");
    setOptions([""]);
    setIsMultipleChoice(false);
    setIsModalOpen(true);
  };

  const handleEditModalOpen = (question: any) => {
    setCurrentQuestionId(question._id);
    setQuestionText(question.questionText);
    setOptions(question.options);
    setIsMultipleChoice(question.isMultipleChoice);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    const newQuestion = {
      questionText,
      options,
      isMultipleChoice,
    };

    try {
      if (currentQuestionId) {
        await putData(
          `/api/depressionQuestions/${currentQuestionId}`,
          newQuestion,
          auth.token,
          null
        );
      } else {
        await postData(
          "/api/depressionQuestions",
          newQuestion,
          auth.token,
          null
        );
      }
      getQuestions(); // Refresh the question list
      setIsModalOpen(false); // Close the modal
    } catch (err) {
      console.log("Error saving question:", err);
    }
  };

  const handleDelete = async (questionId: string) => {
    if (!window.confirm("Are you sure you want to delete this question?")) {
      return;
    }

    try {
      await deleteData(`/api/depressionQuestions/${questionId}`, auth.token);
      getQuestions(); // Refresh the question list
    } catch (err) {
      console.log("Error deleting question:", err);
    }
  };

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = options.slice();
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const removeOption = (index: number) => {
    const newOptions = options.slice();
    newOptions.splice(index, 1);
    setOptions(newOptions);
  };

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
        <SideNavbar />
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
          <Link className="lg:hidden" to="#">
            <Package2Icon className="h-6 w-6" />
            <span className="sr-only">Home</span>
          </Link>
          <div className="w-full flex-1"></div>
          <Button
            onClick={() => {
              dispatch(logout());
              navigate("/");
            }}
          >
            Logout
          </Button>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Service Questions
                </CardTitle>
                <Link className="text-sm font-medium underline" to="#">
                  View All
                </Link>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{questions?.length}</div>
              </CardContent>
            </Card>
          </div>
          <div className="flex justify-end">
            <Button onClick={openModalForNewQuestion}>Add New Question</Button>
          </div>

          <div className="border shadow-sm rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Question</TableHead>
                  <TableHead>Options</TableHead>
                  <TableHead>Multiple Correct</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {questions?.map((question: any) => (
                  <TableRow key={question?._id}>
                    <TableCell className="w-[33%]">
                      {question?.questionText}
                    </TableCell>
                    <TableCell className="w-[20%]">
                      {question?.options?.join(", ")}
                    </TableCell>
                    <TableCell>
                      {question?.isMultipleChoice ? "Yes" : "No"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => handleEditModalOpen(question)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleDelete(question._id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </main>
      </div>

      <CustomModal
        isOpen={isModalOpen}
        toggleModal={() => setIsModalOpen(false)}
      >
        <h2>{currentQuestionId ? "Edit Question" : "Add New Question"}</h2>
        <Input
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          placeholder="Question Text"
          className="my-2"
        />
        <div className="flex flex-col gap-2 my-4">
          {options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                className="flex-1"
              />
              <Button variant="outline" onClick={() => removeOption(index)}>
                Remove
              </Button>
            </div>
          ))}
        </div>

        <Button onClick={addOption}>Add Option</Button>
        <div className="mt-4">
          <label>
            <input
              type="checkbox"
              checked={isMultipleChoice}
              onChange={(e) => setIsMultipleChoice(e.target.checked)}
            />
            Multiple Options Correct
          </label>
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <Button onClick={handleSave}>
            {currentQuestionId ? "Update" : "Save"}
          </Button>
          <Button variant="outline" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
        </div>
      </CustomModal>
    </div>
  );
}

function Package2Icon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
      <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
      <path d="M12 3v6" />
    </svg>
  );
}

// function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <circle cx="11" cy="11" r="8" />
//       <path d="m21 21-4.3-4.3" />
//     </svg>
//   );
// }
