import React, { forwardRef } from "react";

const CustomInput = forwardRef(({ value, onClick }, ref) => (
  <button
		type="button"
		className="w-full p-2 border border-gray-300 rounded-md text-left"
		onClick={onClick}
		ref={ref}
	>
		{value || "Select period"}
	</button>
));

export default CustomInput;