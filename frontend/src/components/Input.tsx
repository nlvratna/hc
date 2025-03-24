import { JSX, ParentComponent } from "solid-js";

interface Props extends JSX.InputHTMLAttributes<HTMLInputElement> {
  type: string;
  label: string;
}
export const Input: ParentComponent<Props> = (props) => {
  return (
    <div>
      {
        <label class="block text-gray-700 text-lg mb-1" for={props.type}>
          {props.label}
        </label>
      }
      <input
        class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
        {...props}
      />
    </div>
  );
};
