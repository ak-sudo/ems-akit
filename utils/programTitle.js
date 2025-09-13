export default function programTitle(programs,programId){
let programeData = {}
programs.map((p)=>{
    programeData[p._id] = p.title
})


if (programeData){
    return programeData[programId]
}}



