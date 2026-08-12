import {
  Box,
  Button,
  Chip,
  Typography,
  Alert,
} from "@mui/material";

import {
  DataGrid,
  type GridColDef,
} from "@mui/x-data-grid";

import {
  useGetClaimsQuery,
  type Claim,
} from "../../features/claims/claimApi";

export default function ClaimsPage() {

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetClaimsQuery();


  /**
   * API response
   *
   * {
   *   success: true,
   *   message: "...",
   *   data: [...]
   * }
   *
   * Depending on your claimsApi transformResponse,
   * data may already be the array.
   */

  const claims = Array.isArray(data)
    ? data
    : data ?? [];


  /**
   * DataGrid columns
   */

  const columns: GridColDef[] = [

    {
      field: "claimNumber",
      headerName: "Claim Number",
      width: 190,
    },

    {
      field: "title",
      headerName: "Claim Title",
      width: 240,
    },

    {
      field: "policyNumber",
      headerName: "Policy Number",
      width: 190,

      valueGetter: (
        _value,
        row
      ) => {

        return (
          row.policy?.policyNumber ||
          "-"
        );

      },
    },

    {
      field: "policyType",
      headerName: "Policy Type",
      width: 140,

      valueGetter: (
        _value,
        row
      ) => {

        return (
          row.policy?.policyType ||
          "-"
        );

      },
    },

    {
      field: "customerName",
      headerName: "Customer",
      width: 220,

      valueGetter: (
        _value,
        row
      ) => {

        if (!row.customer) {
          return "-";
        }

        return `${row.customer.firstName} ${row.customer.lastName}`;

      },
    },

    {
      field: "claimAmount",
      headerName: "Claim Amount",
      width: 160,

      valueGetter: (
        _value,
        row
      ) => {

        return Number(
          row.claimAmount
        );

      },

      valueFormatter: (
        value
      ) => {

        return `₹${Number(
          value
        ).toLocaleString("en-IN")}`;

      },
    },

    {
      field: "approvedAmount",
      headerName: "Approved Amount",
      width: 170,

      valueGetter: (
        _value,
        row
      ) => {

        if (
          row.approvedAmount === null ||
          row.approvedAmount === undefined
        ) {
          return null;
        }

        return Number(
          row.approvedAmount
        );

      },

      valueFormatter: (
        value
      ) => {

        if (
          value === null ||
          value === undefined
        ) {
          return "-";
        }

        return `₹${Number(
          value
        ).toLocaleString("en-IN")}`;

      },
    },

    {
      field: "incidentDate",
      headerName: "Incident Date",
      width: 160,

      valueFormatter: (
        value
      ) => {

        if (!value) {
          return "-";
        }

        return new Date(
          value
        ).toLocaleDateString(
          "en-IN"
        );

      },
    },

    {
      field: "status",
      headerName: "Status",
      width: 150,

      renderCell: (
        params
      ) => {

        return (
          <Chip
            label={
              params.value || "-"
            }
            size="small"
            variant="outlined"
          />
        );

      },
    },

    {
      field: "createdAt",
      headerName: "Created",
      width: 150,

      valueFormatter: (
        value
      ) => {

        if (!value) {
          return "-";
        }

        return new Date(
          value
        ).toLocaleDateString(
          "en-IN"
        );

      },
    },

  ];


  /**
   * Loading state
   */

  const loading =
    isLoading || isFetching;


  /**
   * Error message
   */

  const errorMessage =
    isError
      ? "Unable to load claims."
      : null;


  /**
   * Summary
   */

  const totalClaims =
    claims.length;

  const draftClaims =
    claims.filter(
      (claim: Claim) =>
        claim.status === "DRAFT"
    ).length;

  const activeClaims =
    claims.filter(
      (claim: Claim) =>
        claim.status === "SUBMITTED" ||
        claim.status === "UNDER_REVIEW" ||
        claim.status === "APPROVED"
    ).length;


  return (

    <Box
      sx={{
        width: "100%",
        p: 3,
      }}
    >

      {/* Header */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >

        <Box>

          <Typography
            sx={{
              variant: "h4",
              fontWeight: 600
            }}
          >
            Claims
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 0.5,
            }}
          >
            Manage insurance claims
          </Typography>

        </Box>


        <Button
          variant="contained"
          onClick={() => refetch()}
          disabled={loading}
        >

          {loading
            ? "Loading..."
            : "Refresh"}

        </Button>

      </Box>


      {/* Error */}

      {errorMessage && (

        <Alert
          severity="error"
          sx={{
            mb: 2,
          }}
        >

          {errorMessage}

          {error && (
            <Box
              component="span"
              sx={{
                ml: 1,
              }}
            >
              Check the browser console
              for details.
            </Box>
          )}

        </Alert>

      )}


      {/* Summary Cards */}

      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 2,
          flexWrap: "wrap",
        }}
      >

        <Box
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            px: 3,
            py: 2,
            minWidth: 160,
          }}
        >

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Total Claims
          </Typography>

          <Typography
            sx={{
              variant: "h5",
              fontWeight: 600
            }}
          >
            {totalClaims}
          </Typography>

        </Box>


        <Box
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            px: 3,
            py: 2,
            minWidth: 160,
          }}
        >

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Draft Claims
          </Typography>

          <Typography
            sx={{
              variant: "h5",
              fontWeight: 600
            }}
          >
            {draftClaims}
          </Typography>

        </Box>


        <Box
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            px: 3,
            py: 2,
            minWidth: 160,
          }}
        >

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Active Claims
          </Typography>

          <Typography
            sx={{
              variant: "h5",
              fontWeight: 600
            }}
          >
            {activeClaims}
          </Typography>

        </Box>

      </Box>


      {/* Claims Table */}

      <Box
        sx={{
          width: "100%",
          height: 600,
        }}
      >

        <DataGrid

          rows={claims}

          columns={columns}

          loading={loading}

          getRowId={(row) =>
            row.id
          }

          disableRowSelectionOnClick

          pageSizeOptions={[
            10,
            25,
            50,
            100,
          ]}

          initialState={{
            pagination: {
              paginationModel: {
                page: 0,
                pageSize: 10,
              },
            },
          }}

          sx={{

            backgroundColor:
              "background.paper",

            borderRadius: 2,

            "& .MuiDataGrid-columnHeaders":
            {
              fontWeight: 600,
            },

            "& .MuiDataGrid-cell":
            {
              display: "flex",
              alignItems: "center",
            },

          }}

        />

      </Box>

    </Box>
  );
}