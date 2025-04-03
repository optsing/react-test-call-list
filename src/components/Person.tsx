import personSrc from '../assets/person.svg'

const NO_AVATAR_URL = 'https://lk.skilla.ru/img/noavatar.jpg'

function Person({ personIcon, personName, personSurname }: { personIcon: string, personName: string, personSurname: string }) {
    const personFullName = personName + ' ' + personSurname
    if (!personIcon) {
        return (
            <div
                className='w-8 h-8 rounded-full bg-[#EAF0FA] text-[#002CFB] text-center leading-8 flex items-center justify-center'
                title={personFullName}
            >{personName[0] + personSurname[0]}</div>
        )
    }
    return (
        <img
            className='w-8 h-8 rounded-full bg-cover bg-top'
            title={personFullName}
            alt={personFullName}
            src={personIcon === NO_AVATAR_URL ? personSrc : personIcon}
        />
    )
}

export default Person
