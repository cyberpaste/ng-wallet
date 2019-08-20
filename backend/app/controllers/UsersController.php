<?php

namespace App\Controllers;

use App\Base\Controller;

class UsersController extends Controller
{
    public function authenticate()
    {
        $post = $this->container->get('request')->getParsedBody();
        $data = [];

        $em =  $this->container->get('db')->get('em')->getEntityManager();
        $settings = $this->container->get('settings');
        if (!($post['username'] ?? '') || !($post['password'] ?? '')) {
            return $this->container->get('response')->withJson(['message' => 'Username or password is incorrect'])->withStatus(400);
        }

        $user = $em->getRepository('Users')->findOneBy(['name' => $post['username']]);

        if ($user && $user->getPassword()  == md5($post['password'])) {
            $token = bin2hex(random_bytes(64));
            $tokenExpireDate = time() + $settings['auth']['tokenExpireDate'];
            $user->setToken($token);
            $user->setTokenexpiredate($tokenExpireDate);
            $em->persist($user);
            $em->flush();
            $data['token'] = $token;
            $data['tokenEpireDate'] = $tokenExpireDate;
            $response  = $this->container->get('response')->withJson($data);
        } else {
            $response  = $this->container->get('response')->withJson(['message' => 'Username or password is incorrect'])->withStatus(400);
        }
        return $response;
    }

    public function logout()
    {
        $em =  $this->container->get('db')->get('em')->getEntityManager();
        $headers = $this->container->get('request')->getHeader('Authorization');
        $token = '';
        foreach ($headers as $item) {
            if (preg_match('/Bearer/', $item)) {
                $token = explode(' ', $item)[1] ?? '';
                $token = substr(preg_replace('/[^A-Za-z0-9]/', '', $token), 0, 128);
            }
        }
        $data = [];
        if ($token) {
            $user = $em->getRepository('Users')->findOneBy(['token' => $token]);
            if ($user) {
                $user->setToken(null);
                $user->setTokenexpiredate(null);
                $em->persist($user);
                $em->flush();
            }
        }
        $response = $this->container->get('response')->withJson($data);
        return $response;
    }


    public function usersGet()
    {
        $em =  $this->container->get('db')->get('em')->getEntityManager();
        $balance = $em
            ->getRepository('Users')
            ->createQueryBuilder('c')
            ->getQuery()
            ->getResult(\Doctrine\ORM\Query::HYDRATE_ARRAY);
        $data = $balance ?? [];

        foreach ($data as $key => $item) {
            $data[$key] = [
                'id' => $item['id'],
                'username' => $item['name'],
                'firstname' => $item['firstname'],
                'lastname' => $item['lastname'],
            ];
        }

        $response = $this->container->get('response')->withJson($data);
        return $response;
    }

    public function userAdd()
    {
        $post = $this->container->get('request')->getParsedBody();
        $em =  $this->container->get('db')->get('em')->getEntityManager();
        $existingUser = $em->getRepository('Users')->findBy(['name' => $post['username']]);

        if ($existingUser) {
            $data = ['message' => 'Error. This username cannot be used'];
            return $this->container->get('response')->withJson($data)->withStatus(400);
        }

        if ($post['password'] ?? '') {
            if ($post['password'] !== $post['passwordc']) {
                $data = ['message' => 'Error. Password and confirm password do not match.'];
                return $this->container->get('response')->withJson($data)->withStatus(400);
            }
            if (mb_strlen($post['password']) > 20 || mb_strlen($post['password']) < 6 || mb_strlen($post['passwordc']) > 20 || mb_strlen($post['passwordc']) < 6) {
                $data = ['message' => 'Error. Password and confirm password should be from 6 to 20 length.'];
                return $this->container->get('response')->withJson($data)->withStatus(400);
            }
        } else {
            $data = ['message' => 'Error. Password cannot be blank.'];
            return $this->container->get('response')->withJson($data)->withStatus(400);
        }
        $user = new \Users;
        $user->setName($post['username']);
        $user->setPassword(md5($post['password']));
        $em->persist($user);
        $em->flush();
        $data = [
            'success' => true,
            'id' => $user->getId()
        ];
        $response = $this->container->get('response')->withJson($data);
        return $response;
    }

    public function userDelete($request, $response, $args)
    {
        $em =  $this->container->get('db')->get('em')->getEntityManager();
        $id = $args['id'] ?? '';
        $user = $em->find('Users', $id);
        if ($user) {
            $em->remove($user);
            $em->flush();
        }
        $data = [
            'success' => true,
        ];
        $response = $this->container->get('response')->withJson($data);
        return $response;
    }

    public function userEdit($request, $response, $args)
    {
        $id = $args['id'] ?? '';
        $post = $this->container->get('request')->getParsedBody();
        $em =  $this->container->get('db')->get('em')->getEntityManager();
        $user = $em->find('Users', $id);

        if (!$user) {
            $data = ['message' => 'User not found'];
            return $this->container->get('response')->withJson($data)->withStatus(400);
        }

        if ($post['password'] ?? '') {
            if ($post['password'] !== $post['passwordc']) {
                $data = ['message' => 'Error. Password and confirm password do not match.'];
                return $this->container->get('response')->withJson($data)->withStatus(400);
            }
            if (mb_strlen($post['password']) > 20 || mb_strlen($post['password']) < 6 || mb_strlen($post['passwordc']) > 20 || mb_strlen($post['passwordc']) < 6) {
                $data = ['message' => 'Error. Password and confirm password should be from 6 to 20 length.'];
                return $this->container->get('response')->withJson($data)->withStatus(400);
            }
        }

        $user->setName($post['username']);
        if ($post['password'] ?? '') {
            $user->setPassword(md5($post['password']));
            $user->setToken(null);
            $user->setTokenexpiredate(null);
        }
        $em->persist($user);
        $em->flush();
        $data = [
            'success' => true,
        ];
        $response = $this->container->get('response')->withJson($data);
        return $response;
    }

    public function usersClear()
    {
        $em =  $this->container->get('db')->get('em')->getEntityManager();
        $q = $em->createQuery('DELETE FROM Users')->execute();
        $data = ['ok' => true];
        $response = $this->container->get('response')->withJson($data);
        return $response;
    }
}
