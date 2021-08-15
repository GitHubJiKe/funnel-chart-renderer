import hello from "../src";

test("hello function", () => {
    expect(hello("World")).toEqual("Hello,World");
});
