import { GradeTypes } from "../types"

function Grade({ type }: { type: GradeTypes }) {
    if (type === 'good') {
        return (
            <span className='border rounded-sm px-2 py-1.5 text-sm leading-none text-[#00A775] bg-[#DBF8EF] border-[#28A879]'>
                Отлично
            </span>
        )
    } else if (type === 'normal') {
        return (
            <span className='border rounded-sm px-2 py-1.5 text-sm leading-none text-[#122945] bg-[#D8E4FB] border-[#ADBFDF]'>
                Хорошо
            </span>
        )
    } else if (type === 'bad') {
        return (
            <span className='border rounded-sm px-2 py-1.5 text-sm leading-none text-[#EA1A4F] bg-[#FEE9EF] border-[#EA1A4F]'>
                Плохо
            </span>
        )
    }
}

export default Grade
