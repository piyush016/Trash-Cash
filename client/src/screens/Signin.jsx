import Heading from "../components/Heading";
import SubHeading from "../components/SubHeading";
import InputBox from "../components/InputBox";
import Button from "../components/Button";
import BottomWarning from "../components/BottomWarning";

export default function SignIn() {
  return (
    <div className='flex justify-center h-screen bg-slate-300'>
      <div className='flex flex-col justify-center'>
        <div className='rounded-lg bg-white w-80 text-center p-2 h-max px-4'>
          <Heading label={"Sign In"} />
          <SubHeading label={"Welcome back! Please sign in to your account."} />

          <InputBox
            label={"Username"}
            type={"text"}
            placeholder={"Enter your username"}
          />
          <InputBox
            label={"Password"}
            type={"password"}
            placeholder={"Enter your password"}
          />
          <div className='pt-4'>
            <Button label={"Sign In"} />
          </div>

          <BottomWarning
            label={"Don't have an account?"}
            buttonText={" Sign up"}
            to={"/signup"}
          />
        </div>
      </div>
    </div>
  );
}
