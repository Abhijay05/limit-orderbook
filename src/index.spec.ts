import { app, TICKER } from "./index";
import request from "supertest";
import { resetOrderbook, users } from "./index";






  it("verify initial balances", async () => {
    let res = await request(app).get("/balance/1").send();
    expect(res.body.balances["NIKE"]).toBe(10);
    res = await request(app).get("/balance/2").send();
    expect(res.body.balances["NIKE"]).toBe(10);
  })

  it("Can create tests", async () => {
    await request(app).post("/order").send({
     
      type: "bid",
      price: 1399,
      quantity: 1,
      UserId: "1"
    });

    await request(app).post("/order").send({
      
      type: "ask",
      price: 1400,
      quantity: 10,
      UserId: "2"
    });

    await request(app).post("/order").send({
     
      type: "ask",
      price: 1501,
      quantity: 5,
      UserId: "2"
    })
    let res = await request(app).get("/depth").send();
    expect(res.status).toBe(200);
    expect(res.body.depth["1501"].quantity).toBe(5);
  });

  it("ensures balances are still the same", async () => {
    let res = await request(app).get("/balance/1").send();
    expect(res.body.balances["NIKE"]).toBe(10);
  })

  it("Places an order that fills", async () => {
  // Add an ask at 1400 first
  

  // Then a bid at 1502 that should match 2
  const res = await request(app).post("/order").send({
    type: "bid",
    price: 1502,
    quantity: 2,
    UserId: "1"
  });

  expect(res.body.filledQuantity).toBe(2);
});

  it("Ensures orderbook updates", async () => {
    let res = await request(app).get("/depth").send();
    expect(res.body.depth["1400"]?.quantity).toBe(8);
  })

  it("Ensures balances update", async () => {
    let res = await request(app).get("/balance/1").send();
    expect(res.body.balances["NIKE"]).toBe(12);
    expect(res.body.balances["USD"]).toBe(50000 - 2 * 1400);
    console.log(res.body.balances["USD"]);

    res = await request(app).get("/balance/2").send();
    expect(res.body.balances["NIKE"]).toBe(8);
    expect(res.body.balances["USD"]).toBe(50000 + 2 * 1400);
  })
   



