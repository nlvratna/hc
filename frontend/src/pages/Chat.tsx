import { useNavigate } from "@solidjs/router";
import { useAuth } from "../AuthContext";
import {
  Component,
  ParentComponent,
  Show,
  createEffect,
  createSignal,
  onMount,
} from "solid-js";
import { apiRequest } from "../utils";
import { HOME_URL } from "../Config";

enum Sender {
  System = "system",
  User = "user",
}

interface Message {
  message: string;
  sender: Sender;
}

export default function Chat() {
  const { userLog } = useAuth();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = createSignal(false);
  const [messages, setMessages] = createSignal<Message>({
    message: "",
    sender: Sender.System,
  });
  const [inputMessage, setInputMessage] = createSignal("");
  const [err, setErr] = createSignal("");
  const [aiMessage, setAiMessage] = createSignal(false);
  let previousMessages: Message[] = [];

  createEffect(() => {
    previousMessages.push(messages());
  });

  const handleUserMessage = async () => {
    try {
      setAiMessage(true);
      const response = await apiRequest(`${HOME_URL}/health/remedies`, {
        method: "POST",
        body: JSON.stringify({ symptopms: messages().message }),
      });
      if (response.err) {
        setErr(response.err);
      }
      //this should createEffect if I am not wrong
      setMessages(response.data.split("\n"));
    } catch (err: any) {
      setErr(err);
    } finally {
      setAiMessage(false);
    }
  };

  onMount(() => {
    // Small delay to trigger the transition after component mounts
    setTimeout(() => setIsVisible(true), 10);
  });

  const handleLogin = () => {
    navigate("/login");
  };

  function MessageUI({ text }: { text: string }) {
    return (
      <div
        class={`${
          messages().sender === Sender.System
            ? "bg-blue-500 text-white place-self-end"
            : "bg-gray-200 text-gray-800 place-self-start"
        } rounded-lg p-3 mb-2 max-w-xs break-words`}
      >
        {text}
      </div>
    );
  }

  const handleSendMessage = () => {
    if (inputMessage().trim()) {
      // Just updating UI, not adding functionality
      setInputMessage("");
    }
  };

  // looking fine not bad but test it
  return (
    <>
      <Show when={!userLog()}>
        <div
          class={`min-h-screen fixed inset-0 flex items-center justify-center bg-opacity-30 backdrop-blur-sm z-10 transition-all duration-300 ${
            isVisible() ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            class={`bg-white p-6 rounded-lg shadow-lg text-center transition-transform duration-300 ${
              isVisible() ? "translate-y-0" : "translate-y-8"
            }`}
          >
            <p class="mb-4">Please Login to view this page</p>
            <button
              class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 border rounded-md cursor-pointer"
              onClick={handleLogin}
            >
              Login
            </button>
          </div>
        </div>
      </Show>
      <div class=" min-h-[800px] max-h-[1000px] flex flex-col justify-around  ">
        {/* Chat container */}
        <div class="flex-1 flex flex-col p-4 overflow-hidden">
          {/* Messages area */}
          <div class="flex-1 overflow-y-auto  mb-4 p-2">
            <div class="flex flex-col gap-2">
              <MessageUI text="Hi there! How can I help with your health concerns today?" />
            </div>
            <Show when={err()}>
              <div class="bg-red-100 text-red-700 p-2 rounded mt-2">
                {err()}
              </div>
            </Show>
          </div>

          {/* Input area */}
          <div class="fixed left-0 right-0 bottom-[10px] bg-white rounded-lg  p-2 flex items-end">
            <textarea
              value={inputMessage()}
              onInput={(e) => setInputMessage(e.currentTarget.value)}
              placeholder="Describe your symptoms..."
              class=" font-medium   flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none "
            />
            <button
              onClick={handleSendMessage}
              disabled={aiMessage()}
              class="ml-2 bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:bg-blue-300"
            >
              {aiMessage() ? <span>Sending...</span> : <span>Send</span>}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
