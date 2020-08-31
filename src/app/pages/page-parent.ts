export class PageParent {
    // Animation
    timeoutLength = 600; // Milliseconds
    initialBufferLength = 20; // Milliseconds before the first animation goes; if it's too short sometimes the animation won't happen
    animAppearOffset = 0.25; // Percentage of the timout length between when the header appears and the body appears (looks really cool)
    animDisplaceDist = 16; // # of pixels an object will move when appearing/disappearing

    // Page content
    // pageContent : any = {
    //     ...
    // }

    constructor () { }

    // Animation functions to be overridden
    openAnim() : void { }
    closeAnim(closing : boolean) : void { }
}

/*

"me": [
    {
        tag: "h3",
        content: "Section One/Eins/Un/Uno"
    },
    {
        tag: "p",
        content: "In the spring, the flowers begin to bloom, the snow begins to melt, and P. Diddy atop his great white mountain begins to yodel expletives at the big buzzing wasp that has been terrorizing his home for centuries."
    },
    {
        tag: "p",
        content: "You know what, I think it's O.K. to do it this way.  I'm still trying to decide what the best way is to go about this structure."
    }
],
"experience": [
    {
        tag: "h3",
        content: "Header Game"
    },
    {
        tag: "p",
        content: "P tag to make everybody happy"
    }
],
"contact": [
    {
        tag: "h3",
        content: "LinkedIn"
    },
    {
        tag: "p",
        content: "<a href=\"https://www.linkedin.com/in/taylor-plewe-93361b1a9\" target=\"_blank\">Click Here!</a>"
    }
]

*/