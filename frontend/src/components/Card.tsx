import { ParentComponent } from "solid-js";

export const Card: ParentComponent = (props) => {
  return (
    <>
      <div class="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-xl mb-7">
        {props.children}
      </div>
    </>
  );
};
