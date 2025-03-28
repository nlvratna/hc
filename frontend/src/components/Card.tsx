import { ParentComponent } from "solid-js";

interface Props {
  class?: string;
}

export const Card: ParentComponent<Props> = (props) => {
  return (
    <div
      class={`w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-xl mb-7 ${props.class || ""}`}
    >
      {props.children}
    </div>
  );
};
