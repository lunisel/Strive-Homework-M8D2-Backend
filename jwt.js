import jwt from "jsonwebtoken"

const token = jwt.sign({ _id: "io1j2i3oj2o1i3jo12j3" }, "process.env.JWT_SECRET", { expiresIn: "10s" })

console.log(token)

try {
  jwt.verify(
    token,
    "process.env.JWT_SECRET"
  )
} catch (error) {
  console.log(error)
}

