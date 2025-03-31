import { useNavigate } from "@solidjs/router";
import { useAuth } from "../AuthContext";
import {
  For,
  Index,
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

// try to send request to gemini in a way I want it to respond I don't think it's way that works but we will try
export default function Chat() {
  const { userLog } = useAuth();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = createSignal(false);
  const [messages, setMessages] = createSignal<Message>({
    message: "Hello what is your problem",
    sender: Sender.System,
  });
  const [err, setErr] = createSignal("");
  const [aiMessage, setAiMessage] = createSignal(false);
  const [previousMessages, setPreviousMessages] = createSignal<Message[]>([]);

  createEffect(() => {
    // it is working
    console.log("code is at createEffect");
    setPreviousMessages((prev) => [...prev, messages()]);
  });

  const handleUserMessage = async () => {
    try {
      setAiMessage(true);
      const body = JSON.stringify({ symptoms: messages().message });
      console.log(body);
      const response = await apiRequest(`${HOME_URL}/health/remedies`, {
        method: "POST",
        body: body,
      });
      if (response.err) {
        setErr(response.err);
      }
      //this should createEffect if I am not wrong
      setMessages({
        message: response.data.response.replace(/\n/g, " "),
        sender: Sender.System,
      });

      console.log("logging previous messages");
      console.log(previousMessages());
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

  //add some form of animation for the dots
  function MessageUI(input: Message) {
    return (
      <div
        class={`${
          input.sender === Sender.System
            ? "bg-green-500/85 text-white ml-auto"
            : "bg-gray-200 text-gray-800 mr-auto"
        } rounded-lg p-3 mb-2 max-w-md break-words`}
      >
        {input.message}
      </div>
    );
  }
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
      <div class=" min-h-screen flex flex-col  justify-between w-full max-w-4xl mx-auto px-4 ">
        {/* Chat container */}
        <div class="flex-1 flex flex-col p-4 overflow-hidden">
          {/* Messages area */}
          <div class="flex-1 overflow-y-auto  mb-4 p-2">
            <div class="flex flex-col gap-2">
              {/* might be reactivity */}
              <Index each={previousMessages()}>
                {(message, _index) => (
                  <MessageUI
                    message={message().message}
                    sender={message().sender}
                  />
                )}
              </Index>
            </div>
            <Show when={err()}>
              <div class="bg-red-100 text-red-700 p-2 rounded mt-2">
                {err()}
              </div>
            </Show>
          </div>

          {/* Input area */}
          <div>
            <div class="fixed left-0 right-0 bottom-[10px] bg-white rounded-lg  p-2 flex items-end ">
              <textarea
                value={
                  messages().sender === Sender.User ? messages().message : ""
                }
                onChange={(e) => {
                  setMessages({ message: e.target.value, sender: Sender.User });
                }}
                placeholder="Describe your symptoms..."
                class="font-medium flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none min-h-[80px]"
              />
              <button
                onClick={handleUserMessage}
                disabled={aiMessage()}
                class="cursor-pointer ml-2 bg-green-500 text-white rounded-lg px-4 py-2 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors disabled:bg-green-300 h-[40px] self-end"
              >
                {aiMessage() ? <span>Sending...</span> : <span>Send</span>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
