import React from "react"

const CommonTextArea = ({ id, placeholder, onChange, required, disabled, readOnly }: { id: string, placeholder?: string, onChange: (value: string) => void, required?: boolean, disabled?: boolean, readOnly?: boolean }) => {
    return (
        <textarea
            required={required}
            disabled={disabled}
            readOnly={readOnly}
            id={id}
            className="block p-2.5 w-full text-sm text-black rounded-lg border border-gray-300"
            placeholder={placeholder || ""}
            onChange={(e) => onChange(e.target.value)}
        ></textarea>
    )
}
export default CommonTextArea