import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";

const passwordValidator = require("password-validator");
const passwordSchema = new passwordValidator();

passwordSchema
    .is()
    .min(8)
    .is()
    .max(20)
    .has()
    .uppercase()
    .has()
    .lowercase()
    .has()
    .digits(1)
    .has()
    .not()
    .spaces()
    .is()
    .not()
    .oneOf(["Password"]);

export interface IUser extends Document {
    username: string;
    password: string;
    comparePassword(candidatePassword: string): Promise<boolean>;
    email: string;
    role: ["admin", "user"];
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
}

const UserSchema: Schema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        maxlength: 30,
        minlength: 3,
        validate: {
            validator: function (v: string) {
                return /^[a-zA-Z][a-zA-Z0-9._]*$/.test(v);
            },
            message: (props: any) =>
                `${props.value} no es un username válido. Debe comenzar con una letra y solo puede contener letras, números, putos y guiones bajos○`,
        },
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: (v: string) => {
                return passwordSchema.validate(v);
            },
            message:
                "La contraseña debe tener al menos 8 caracteres, al menos una letra mayúscula, una letra minúscula y un númer",
        },
    },
    phone: {
        type: Number,
        required: true,
        validate: {
            validator: (v: string) => /^[0-9]{9}$/.test(v),
            message: "El número de celular debe tener 9 dígitos",
        },
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (v: string) =>
                /^[a-zA-Z][a-zA-Z0-9._-]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/.test(v),
            message: "Correo electrónico inválido",
        },
    },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
    deletedAt: { type: Date },
    lastLogin: Date,
});

UserSchema.pre<IUser>("save", async function (next) {
    if (!this.isModified("password")) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error: any) {
        next(error);
    }
});

UserSchema.methods.comparePassword = async function (
    password: string,
): Promise<boolean> {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        throw error;
    }
};

export default mongoose.model<IUser>("User", UserSchema);
