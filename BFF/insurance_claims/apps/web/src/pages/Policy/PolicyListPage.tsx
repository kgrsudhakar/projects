import {

Button,

Stack,

Typography

} from "@mui/material";

import PolicyTable from "../../components/policy/PolicyTable";

export default function PolicyListPage(){

return(

<>

<Stack

sx={{
direction:"row",
justifyContent:"space-between",
mb:3
}}



>

<Typography variant="h4">

Policies

</Typography>

<Button

variant="contained"

>

New Policy

</Button>

</Stack>

<PolicyTable/>

</>

);

}