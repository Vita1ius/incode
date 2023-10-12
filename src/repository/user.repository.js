import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


export async function create(
  username, passwordHash, role, bossId
  ){
  return prisma.user.create({
    data: {
      username,
      passwordHash,
      role,
      bossId
    },
  });
}

export async function login(username){
  return prisma.user.findUnique({
    where: {
      username : username
    }
  });
}

export async function findById(id){
  return prisma.user.findUnique({
    where: {
      id
    }
  })
}

export async function updateRole(id, newRole){
  return prisma.user.update({
    where: { id: id },
    data: {
      role: newRole
    }
  });
}


export async function getUsersByRole(userRole, userId) {
  if (userRole === 'ADMINISTRATOR') {
    const users = await prisma.user.findMany();
    return users;
  } else if (userRole === 'BOSS') {
    const bossAndSubordinates = await prisma.user.findMany({
      where: {
        OR: [
          {
            id: userId,
          },
          {
            bossId: userId,
          },
        ],
      },
    });
    return bossAndSubordinates;
  } else {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    return user ? [user] : [];
  }
}

export async function findByBossId(id){
  return prisma.user.findFirst({
    where: {
      bossId: id
    }
  })
}

export async function changeBoss(newBossId, subordinateId){
  return prisma.user.update({
    where: {
      id: subordinateId,
    },
    data: {
      bossId: newBossId,
    },
  });
}

export async function countOfSubordinates (id){
  return prisma.user.count({
    where: {
      bossId: id,
    },
  });
}