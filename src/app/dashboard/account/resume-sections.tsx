interface Resume {
    title: string,
    subTitle: string,
    description: string
}

export const resumeSections: Resume[] = [
    {
        title: "Profile Details",
        subTitle: "Add / Update Your Profile Details",
        description: "We recommend sharing both an email address and a phone number for seamless communication."
    },
    {
        title: "Work History",
        subTitle: "Add / Update Your Work History.",
        description: "You can include any work experience, internships, scholarships, relevant coursework and academic achievements."
    },
    {
        title: "Education",
        subTitle: "Add / Update Your Education",
        description: "Provide details of your academic qualifications, including institutions, degrees, and relevant coursework."
    },
    {
        title: "Skills",
        subTitle: "Add / Update Your Skills",
        description: "List your relevant skills that demonstrate your ability to perform in the desired role."
    },
    {
        title: "Professional Summary",
        subTitle: "Add / Update Your Professional Summary",
        description: "Overview of Key Roles and Achievements, Plus Your Essential Social Media and Website Links"
    }
];


export default resumeSections