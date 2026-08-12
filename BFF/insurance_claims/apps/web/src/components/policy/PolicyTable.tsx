import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import { useGetPoliciesQuery } from "../../features/policy/policyApi";

const columns: GridColDef[] = [{

    field: "policyNumber",
    headerName: "Policy No",
    width: 180
},

{
    field: "policyType",
    headerName: "Type",
    width: 150
},

{
    field: "premiumAmount",
    headerName: "Premium",
    width: 150
},

{
    field: "coverageAmount",
    headerName: "Coverage",
    width: 180
},

{
    field: "status",
    headerName: "Status",
    width: 140
}
];

export default function PolicyTable() {

    const {

        data,

        isLoading

    } = useGetPoliciesQuery();

    console.log("Policies:", data);


    if (isLoading) {

        return <>Loading...</>;

    }

    return (

        <div style={{

            height: 600,

            width: "100%"

        }}>

            <DataGrid

                rows={data ?? []}

                columns={columns}

                getRowId={(row) => row.id}
                pageSizeOptions={[10, 20, 50, 100]}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 10,
                            page: 0,
                        },
                    },
                }}

            />

        </div>

    );

}