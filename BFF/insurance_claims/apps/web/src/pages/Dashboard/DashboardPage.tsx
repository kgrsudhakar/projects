import {
  Grid,
  Card,
  CardContent,
  Typography,
} from "@mui/material";

const cards = [
  {
    title: "Policies",
    value: 150,
  },
  {
    title: "Claims",
    value: 48,
  },
  {
    title: "Approved",
    value: 35,
  },
  {
    title: "Pending",
    value: 13,
  },
];

export default function DashboardPage() {
  return (
    <Grid container spacing={3}>
      {cards.map((card) => (
        <Grid
          key={card.title}
          size={{ xs: 12, md: 3 }}
        >
          <Card>
            <CardContent>
              <Typography variant="h6">
                {card.title}
              </Typography>

              <Typography variant="h3">
                {card.value}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}