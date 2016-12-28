abstract class X<Msg> {
  Msg: Msg
}

class U extends X<string> {

}

class E extends X<number> {

}

class J<T extends X<any>> {
  msg: T['Msg']
}

function create(): J<U> {
  return new J<U>()
}

const u = create()
u.msg
